import { getPreviousSeasonStart, getCurrentSeasonEnd, getSeason } from "../helper/animeseason";
import groupArrSplice from "../helper/groupsplice";
import KodikApiService from "./KodikApiService";
import ShikimoriApiService from "./ShikimoriApiService";
import { ShikimoriAnime, followType, ServerError } from "../ts/index";
import { KodikAnimeFull, checkAnime } from "../ts/kodik";
import AnimeUpdateService from "./AnimeUpdateService";
import NotificationService from "./NotificationService";
import { prisma } from "../db";
import { AnimeStatuses, FollowTypes, RequestStatuses } from "../ts/enums";
import { logger } from "../loggerConf"

export default class AutoCheckService {
    animeUpdateService: AnimeUpdateService;
    constructor() {
        this.animeUpdateService = new AnimeUpdateService();
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
                logger.info(`New anime found ${kodikAnime.title}`)
                return;
            }
            this.animeUpdateService.updateAnimeShikimori([shikimoriAnime]);
            logger.info(`New anime found ${shikimoriAnime.name}`)
            return;
        }

        if (haveFollow && follow.status === FollowTypes.Announcement) {
            const changedStatus = anime.status !== status;
            if (changedStatus && anime.status === AnimeStatuses.Announced && status === "ongoing") {
                // if status changed to ongoing
                NotificationService.notifyRelease(anime.id);
                // notify all followers about it
                for (const single of follow.info) {
                  
                    NotificationService.notifyUserRelease(single.user_id, anime.id);
                    logger.info(`Need to notify user ${single.user_id} that ${anime.name} began releasing`)
                  
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
        if (haveFollow && follow.status === FollowTypes.Follow) {
            followedTranslationIds = follow.info.map(single => single.translation!.group_id);
        }
        for (const translation of anime.anime_translations) {
            const kodikTranslation = kodikAnime.translations.find(kodikTranslation => translation.group_id === kodikTranslation.id)
            if (kodikTranslation === undefined) continue;
            if (kodikTranslation.episodes_count === translation.current_episodes) continue;
            const isFinalEpisode = kodikTranslation.episodes_count === anime.max_episodes;
            logger.info(`NEW Episode: ${anime.name}: ${kodikTranslation.title} ${kodikTranslation.episodes_count}`);
            if (isFinalEpisode) {
                NotificationService.notifyFinalEpisode(anime.id, kodikTranslation.id, kodikTranslation.episodes_count);
            } else {
                NotificationService.notifyEpisode(anime.id, kodikTranslation.id, kodikTranslation.episodes_count);
            }
            // if no one has followed this translation, skip
            if (followedTranslationIds.indexOf(kodikTranslation.id) < 0) continue;
            for (const single of follow!.info) {
                if (single.translation?.group_id !== kodikTranslation.id) continue;
                // notify users
                if (!isFinalEpisode) {

                    NotificationService.notifyUserEpisode(single.user_id, anime.id, kodikTranslation.id, kodikTranslation.episodes_count)
                    logger.info(`Need to notify user ${single.user_id} that ${kodikTranslation.title} group uploaded a ${kodikTranslation.episodes_count} episode`)

                    continue;
                }
                NotificationService.notifyUserFinalEpisode(
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
                logger.info(`Need to notify user ${single.user_id} that ${kodikTranslation.title} group uploaded a final ${kodikTranslation.episodes_count} episode`)
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
            if (error.reqStatus === RequestStatuses.InternalServerError) throw new Error("Shikimori 500");
            const shikimoriAnime = anime as ShikimoriAnime[];
            if ((shikimoriAnime.length == 0 || shikimoriAnime.length < 50) && seasonString != currentSeasonString) {
                seasonString = currentSeasonString
                page = 0;
                continue;
            }
            logger.info(`Getting base anime from shikimori, page:${page}, season:${seasonString}`);
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
        logger.info("Getting anime from shikimori")
        const shikimoriRes: Promise<any>[] = idsSpliced.flatMap(async batch => {
            let response = await shikimoriApi.getBatchAnime(batch);
            if ((<ServerError>response).reqStatus === RequestStatuses.InternalServerError) throw new Error("Shikimori 500");
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