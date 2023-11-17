import { getPreviousSeasonStart, getCurrentSeasonEnd, getSeason } from "../helper/animeseason";
import groupArrSplice from "../helper/groupsplice";
import KodikApiService from "./KodikApiService";
import ShikimoriApiService from "./ShikimoriApiService";
import { ShikimoriAnime, followType, ServerError } from "../ts/index";
import { KodikAnimeFull, checkAnime } from "../ts/kodik";
import AnimeUpdateService from "./AnimeUpdateService";
import NotificationService from "./NotificationService";
import { prisma } from "../db";

export default class AutoCheckService {
    animeUpdateService: AnimeUpdateService;
    notificationService: NotificationService;
    constructor() {
        this.animeUpdateService = new AnimeUpdateService();
        this.notificationService = new NotificationService();
    }

    async checkAnime(shikimoriAnime: ShikimoriAnime, kodikAnime?: KodikAnimeFull, follow?: followType, anime?: checkAnime) {
        const { status } = shikimoriAnime;
        const haveKodik = kodikAnime !== undefined;
        const haveDbAnime = anime !== undefined;
        const haveFollow = follow !== undefined;
        // if we have no anime in db, create it and exit
        if (!haveDbAnime) {
            if (haveKodik) {
                this.animeUpdateService.updateAnimeKodik([kodikAnime]);
                console.log(`New anime found ${kodikAnime.title}`)
                return;
            }
            this.animeUpdateService.updateAnimeShikimori([shikimoriAnime]);
            console.log(`New anime found ${shikimoriAnime.name}`)
            return;
        }

        if (haveFollow && follow.status === "announcement") {
            const changedStatus = anime.status !== status;
            if (changedStatus && anime.status === "anons" && status === "ongoing") {
                // if status changed to ongoing
                this.notificationService.notifyRelease(anime.id);
                // notify all followers about it
                for (const single of follow.info) {
                    this.notificationService.notifyUserRelease(single.user_id, anime.id);
                    console.log(`Need to notify user ${single.user_id} that ${anime.name} began releasing`)
                    // delete follow from db
                    prisma.follow.deleteMany({
                        where: {
                            AND: [
                                { anime_id: anime.id, },
                                { user_id: single.user_id }
                            ]
                        }
                    })
                }
            }
        }
        if (!haveKodik) {
            return this.animeUpdateService.updateAnimeShikimori([shikimoriAnime]);
        }

        let followedTranslationIds: number[] = []
        if (haveFollow && follow.status === "follow") {
            followedTranslationIds = follow.info.map(single => single.translation!.group_id);
        }
        for (const translation of anime.anime_translations) {
            const kodikTranslation = kodikAnime.translations.find(kodikTranslation => translation.group_id === kodikTranslation.id)
            if (kodikTranslation === undefined) continue;
            if (kodikTranslation.episodes_count === translation.current_episodes) continue;
            const isFinalEpisode = kodikTranslation.episodes_count === anime.max_episodes;
            console.log(`NEW Episode: ${anime.name}: ${kodikTranslation.title} ${kodikTranslation.episodes_count}`);
            if (isFinalEpisode) {
                this.notificationService.notifyFinalEpisode(anime.id, kodikTranslation.id, kodikTranslation.episodes_count);
            } else {
                this.notificationService.notifyEpisode(anime.id, kodikTranslation.id, kodikTranslation.episodes_count);
            }
            // if no one has followed this translation, skip
            if (followedTranslationIds.indexOf(kodikTranslation.id) < 0) continue;
            for (const single of follow!.info) {
                if (single.translation?.group_id !== kodikTranslation.id) continue;
                // notify users
                if (!isFinalEpisode) {
                    this.notificationService.notifyUserEpisode(single.user_id, anime.id, kodikTranslation.id, kodikTranslation.episodes_count)
                    console.log(`Need to notify user ${single.user_id} that ${kodikTranslation.title} group uploaded a ${kodikTranslation.episodes_count} episode`)
                    continue;
                }
                this.notificationService.notifyUserFinalEpisode(
                    single.user_id,
                    anime.id,
                    kodikTranslation.id,
                    kodikTranslation.episodes_count
                );
                prisma.follow.deleteMany({
                    where: {
                        AND: [
                            { anime_id: anime.id, },
                            { translation_id: translation.id, },
                            { user_id: single.user_id }
                        ]
                    }
                })
                console.log(`Need to notify user ${single.user_id} that ${kodikTranslation.title} group uploaded a final ${kodikTranslation.episodes_count} episode`)
            }
        }

        // update anime and translations
        this.animeUpdateService.updateAnimeKodik([kodikAnime]);
        this.animeUpdateService.updateTranslations(kodikAnime, anime);

    }

    async getDefaultAnime(): Promise<ShikimoriAnime[]> {
        const user: undefined = undefined; // No user is required
        const shikimoriApi = new ShikimoriApiService(user);
        const checkAnime: ShikimoriAnime[] = [];
        const date = new Date();
        const prevSeasonStart = getPreviousSeasonStart(date);
        const currentSeasonEnd = getCurrentSeasonEnd(date)

        const prevSeasonString = `${getSeason(prevSeasonStart)}_${prevSeasonStart.getFullYear()}`;
        const currentSeasonString = `${getSeason(currentSeasonEnd)}_${currentSeasonEnd.getFullYear()}`;
        let seasonString = prevSeasonString;
        let page = 0;
        do {
            const anime = await shikimoriApi.getSeasonAnimeByPage(page, seasonString);
            if (!anime) throw new Error("Admin account not linked");
            const error = anime as ServerError;
            if (error.reqStatus === 500) throw new Error("Shikimori 500");
            const shikimoriAnime = anime as ShikimoriAnime[];
            if ((shikimoriAnime.length == 0 || shikimoriAnime.length < 50) && seasonString != currentSeasonString) {
                seasonString = currentSeasonString
                page = 0;
                continue;
            }
            console.log(`Getting base anime from shikimori, page:${page}, season:${seasonString}`);
            checkAnime.push(...shikimoriAnime);
            if (shikimoriAnime.length == 0 || shikimoriAnime.length < 50) break
            page += 1;
        } while (true);
        return checkAnime;
    }

    async getAnime(ids: number[]) {
        const user: undefined = undefined; // No user is required
        const shikimoriApi = new ShikimoriApiService(user);
        const idsSpliced = groupArrSplice(ids, 50);
        console.log("Getting anime from shikimori")
        const shikimoriRes: Promise<any>[] = idsSpliced.flatMap(async batch => {
            let response = await shikimoriApi.getBatchAnime(batch);
            if ((<ServerError>response).reqStatus === 500) throw new Error("Shikimori 500");
            return (<ShikimoriAnime[]>response);
        });
        let followedAnime: ShikimoriAnime[] = await Promise.all(shikimoriRes.flatMap(async p => await p));
        followedAnime = followedAnime.flat();
        return followedAnime;
    }

    async getKodikAnime(anime: ShikimoriAnime[]): Promise<KodikAnimeFull[]> {
        const kodikApi = new KodikApiService();
        const animeIds: number[][] = groupArrSplice(anime.map(a => a.id), 10);
        const animeResult: KodikAnimeFull[] = [];
        for (const animeBatch of animeIds) {
            const kodikAnime = await kodikApi.getFullBatchAnime(animeBatch);
            animeResult.push(...kodikAnime as KodikAnimeFull[]);
        }
        return animeResult;
    }

}