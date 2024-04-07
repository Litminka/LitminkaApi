import { getPreviousSeasonStart, getCurrentSeasonEnd, getSeason } from "@/helper/animeseason";
import groupArrSplice from "@/helper/groupsplice";
import KodikApiService from "@services/KodikApiService";
import ShikimoriApiService from "@services/shikimori/ShikimoriApiService";
import { ShikimoriAnime, followType } from "@/ts/index";
import { KodikAnimeFull, animeWithTranslation } from "@/ts/kodik";
import AnimeUpdateService from "@services/anime/AnimeUpdateService";
import NotificationService from "@services/NotificationService";
import prisma from "@/db";
import { AnimeStatuses, FollowTypes, RequestStatuses } from "@/ts/enums";
import { logger } from "@/loggerConf"
import { ShikimoriGraphAnime } from "@/ts/shikimori";


export default class AutoCheckService {
    animeUpdateService: AnimeUpdateService;
    constructor() {
        this.animeUpdateService = new AnimeUpdateService();
    }

    async checkAnime(shikimoriAnime: ShikimoriGraphAnime, kodikAnime?: KodikAnimeFull, follow?: followType, anime?: animeWithTranslation) {
        const { status } = shikimoriAnime;
        const haveKodik = kodikAnime !== undefined;
        const haveDbAnime = anime !== undefined;
        const haveFollow = follow !== undefined;
        // if we have no anime in db, create it and exit
        if (!haveDbAnime) {
            this.animeUpdateService.createShikimoriGraphAnime(shikimoriAnime, kodikAnime);
            logger.info(`New anime found ${shikimoriAnime.name}`)
            return;
        }

        if (haveFollow && follow.status === FollowTypes.Announcement) {
            const changedStatus = anime.status !== status;
            if (changedStatus && anime.status === AnimeStatuses.Announced && status === AnimeStatuses.Ongoing) {
                // if status changed to ongoing
                NotificationService.notifyRelease(anime.id);
                // notify all followers about it
                for (const single of follow.info) {

                    NotificationService.notifyUserRelease(single.userId, anime.id);
                    logger.info(`Need to notify user ${single.userId} that ${anime.name} began releasing`)

                    // delete follow from db
                    prisma.follow.deleteMany({
                        where: {
                            animeId: anime.id,
                            userId: single.userId
                        },
                    })
                }
            }
        }
        if (!haveKodik) {
            return this.animeUpdateService.updateShikimoriGraphAnime(shikimoriAnime, anime, kodikAnime);
        }

        let followedTranslationIds: number[] = []
        if (haveFollow && follow.status === FollowTypes.Follow) {
            followedTranslationIds = follow.info.map(single => single.translation!.groupId);
        }
        for (const translation of anime.animeTranslations) {
            const kodikTranslation = kodikAnime.translations.find(kodikTranslation => translation.groupId === kodikTranslation.id)
            if (kodikTranslation === undefined) continue;
            if (kodikTranslation.episodes_count === translation.currentEpisodes) continue;
            const isFinalEpisode = kodikTranslation.episodes_count === anime.maxEpisodes;
            logger.info(`NEW Episode: ${anime.name}: ${kodikTranslation.title} ${kodikTranslation.episodes_count}`);
            if (isFinalEpisode) {
                NotificationService.notifyFinalEpisode(anime.id, kodikTranslation.id, kodikTranslation.episodes_count);
            } else {
                NotificationService.notifyEpisode(anime.id, kodikTranslation.id, kodikTranslation.episodes_count);
            }
            // if no one has followed this translation, skip
            if (followedTranslationIds.indexOf(kodikTranslation.id) < 0) continue;
            for (const single of follow!.info) {
                if (single.translation?.groupId !== kodikTranslation.id) continue;
                // notify users
                if (!isFinalEpisode) {

                    NotificationService.notifyUserEpisode(single.userId, anime.id, kodikTranslation.id, kodikTranslation.episodes_count)
                    logger.info(`Need to notify user ${single.userId} that ${kodikTranslation.title} group uploaded a ${kodikTranslation.episodes_count} episode`)

                    continue;
                }
                NotificationService.notifyUserFinalEpisode(
                    single.userId,
                    anime.id,
                    kodikTranslation.id,
                    kodikTranslation.episodes_count
                );
                await prisma.follow.deleteMany({
                    where: {
                        animeId: anime.id,
                        translationId: translation.id,
                        userId: single.userId

                    }
                })
                logger.info(`Need to notify user ${single.userId} that ${kodikTranslation.title} group uploaded a final ${kodikTranslation.episodes_count} episode`)
            }
        }

        // update anime and translations
        await this.animeUpdateService.updateShikimoriGraphAnime(shikimoriAnime, anime, kodikAnime);
        await this.animeUpdateService.updateTranslations(kodikAnime, anime);

    }

    async getDefaultAnime(): Promise<ShikimoriGraphAnime[]> {
        const user: undefined = undefined; // No user is required
        const shikimoriApi = new ShikimoriApiService(user);
        const checkAnime: ShikimoriGraphAnime[] = [];
        const date = new Date();
        const prevSeasonStart = getPreviousSeasonStart(date);
        const currentSeasonEnd = getCurrentSeasonEnd(date)

        const prevSeasonString = `${getSeason(prevSeasonStart)}_${prevSeasonStart.getFullYear()}`;
        const currentSeasonString = `${getSeason(currentSeasonEnd)}_${currentSeasonEnd.getFullYear()}`;
        let seasonString = prevSeasonString;
        let page = 1;
        do {
            const shikimoriAnimeRequest = await shikimoriApi.getGraphAnimeBySeason(page, seasonString);
            const shikimoriAnime = shikimoriAnimeRequest.data.animes;
            if ((shikimoriAnime.length == 0 || shikimoriAnime.length < 50) && seasonString != currentSeasonString) {
                seasonString = currentSeasonString
                page = 1;
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
            let response = await shikimoriApi.getBatchGraphAnime(batch);
            return response.data.animes;
        });
        let followedAnime: ShikimoriGraphAnime[] = await Promise.all(shikimoriRes.flatMap(async p => await p));
        followedAnime = followedAnime.flat();
        return followedAnime;
    }

    async getKodikAnime(anime: ShikimoriGraphAnime[]): Promise<KodikAnimeFull[]> {
        const kodikApi = new KodikApiService();
        const animeIds: number[][] = groupArrSplice(anime.map(a => a.id), 10);
        const animeResult: KodikAnimeFull[] = [];
        for (const animeBatch of animeIds) {
            const kodikAnime = await kodikApi.getFullBatchAnime(animeBatch);
            animeResult.push(...kodikAnime as KodikAnimeFull[]);
        }
        return animeResult;
    }


    async updateGroups() {
        logger.info('began updating groups')
        const kodikApi = new KodikApiService();
        const translations = await kodikApi.getTranslationGroups();
        for (const translation of translations) {
            await prisma.group.upsert({
                where: {
                    id: translation.id,
                },
                create: {
                    id: translation.id,
                    name: translation.title,
                    type: translation.type,
                },
                update: {
                    id: translation.id,
                    name: translation.title,
                    type: translation.type,
                }
            })

        }
        logger.info('finished updating groups')
    }
}