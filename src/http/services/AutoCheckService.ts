import { getPreviousSeasonStart, getCurrentSeasonEnd, getSeason } from '@/helper/animeseason';
import groupArrSplice from '@/helper/groupsplice';
import KodikApiService from '@services/KodikApiService';
import ShikimoriApiService from '@services/shikimori/ShikimoriApiService';
import { FollowType } from '@/ts/follow';
import { KodikAnimeFull, animeWithTranslation } from '@/ts/kodik';
import AnimeUpdateService from '@services/anime/AnimeUpdateService';
import NotificationService from '@services/NotificationService';
import prisma from '@/db';
import { AnimeStatuses, FollowTypes } from '@enums';
import { logger } from '@/loggerConf';
import { ShikimoriGraphAnime } from '@/ts/shikimori';
import FollowService from '@services/FollowService';

export default class AutoCheckService {
    animeUpdateService: AnimeUpdateService;
    constructor() {
        this.animeUpdateService = new AnimeUpdateService();
    }

    async checkAnime(
        shikimoriAnime: ShikimoriGraphAnime,
        kodikAnime?: KodikAnimeFull,
        follow?: FollowType,
        anime?: animeWithTranslation
    ) {
        const { status } = shikimoriAnime;
        const haveKodik = kodikAnime !== undefined;
        const haveDbAnime = anime !== undefined;
        const haveFollow = follow !== undefined;
        // if we have no anime in db, create it and exit
        if (!haveDbAnime) {
            this.animeUpdateService.createShikimoriGraphAnime(shikimoriAnime, kodikAnime);
            logger.debug(`[autocheck]: New anime found ${shikimoriAnime.name}`);
            return;
        }

        if (haveFollow && follow.status === FollowTypes.Announcement) {
            const changedStatus = anime.status !== status;
            if (
                changedStatus &&
                anime.status === AnimeStatuses.Announced &&
                status === AnimeStatuses.Ongoing
            ) {
                // if status changed to ongoing
                NotificationService.notifyRelease(anime.id);
                // notify all followers about it
                for (const single of follow.info) {
                    NotificationService.notifyUserRelease(single.userId, anime.id);
                    logger.debug(
                        `[autocheck]: Need to notify user ${single.userId} that ${anime.name} began releasing`
                    );

                    // delete follow from db
                    prisma.follow.deleteMany({
                        where: {
                            animeId: anime.id,
                            userId: single.userId
                        }
                    });
                }
            }
        }
        if (!haveKodik) {
            return this.animeUpdateService.updateShikimoriGraphAnime(
                shikimoriAnime,
                anime,
                kodikAnime
            );
        }

        let followedTranslationIds: number[] = [];
        if (haveFollow && follow.status === FollowTypes.Follow) {
            followedTranslationIds = follow.info.map((single) => {
                return single.translation!.groupId;
            });
        }
        for (const translation of anime.animeTranslations) {
            const kodikTranslation = kodikAnime.translations.find((kodikTranslation) => {
                return translation.groupId === kodikTranslation.id;
            });
            if (kodikTranslation === undefined) continue;
            if (kodikTranslation.episodes_count === translation.currentEpisodes) continue;
            const isFinalEpisode = kodikTranslation.episodes_count === anime.maxEpisodes;
            logger.debug(
                `[autocheck]: NEW Episode: ${anime.name}: ${kodikTranslation.title} ${kodikTranslation.episodes_count}`
            );
            if (isFinalEpisode) {
                NotificationService.notifyFinalEpisode(
                    anime.id,
                    kodikTranslation.id,
                    kodikTranslation.episodes_count
                );
            } else {
                NotificationService.notifyEpisode(
                    anime.id,
                    kodikTranslation.id,
                    kodikTranslation.episodes_count
                );
            }
            // if no one has followed this translation, skip
            if (followedTranslationIds.indexOf(kodikTranslation.id) < 0) continue;
            for (const single of follow!.info) {
                if (single.translation?.groupId !== kodikTranslation.id) continue;
                // notify users
                if (!isFinalEpisode) {
                    NotificationService.notifyUserEpisode(
                        single.userId,
                        anime.id,
                        kodikTranslation.id,
                        kodikTranslation.episodes_count
                    );
                    logger.debug(
                        `[autocheck]: Need to notify user ${single.userId} that ${kodikTranslation.title} group uploaded a ${kodikTranslation.episodes_count} episode`
                    );

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
                });
                logger.debug(
                    `[autocheck]: Need to notify user ${single.userId} that ${kodikTranslation.title} group uploaded a final ${kodikTranslation.episodes_count} episode`
                );
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
        const currentSeasonEnd = getCurrentSeasonEnd(date);

        const prevSeasonString = `${getSeason(prevSeasonStart)}_${prevSeasonStart.getFullYear()}`;
        const currentSeasonString = `${getSeason(currentSeasonEnd)}_${currentSeasonEnd.getFullYear()}`;
        let seasonString = prevSeasonString;
        let page = 1;
        do {
            const shikimoriAnimeRequest = await shikimoriApi.getGraphAnimeBySeason(
                page,
                seasonString
            );
            const shikimoriAnime = shikimoriAnimeRequest.data.animes;
            if (
                (shikimoriAnime.length == 0 || shikimoriAnime.length < 50) &&
                seasonString != currentSeasonString
            ) {
                seasonString = currentSeasonString;
                page = 1;
                continue;
            }
            logger.debug(
                `[autocheck]: Getting base anime from shikimori, page:${page}, season:${seasonString}`
            );
            checkAnime.push(...shikimoriAnime);
            if (shikimoriAnime.length == 0 || shikimoriAnime.length < 50) break;
            page += 1;
        } while (true);

        return checkAnime;
    }

    async getAnnounces(): Promise<ShikimoriGraphAnime[]> {
        const user: undefined = undefined; // No user is required
        const shikimoriApi = new ShikimoriApiService(user);
        const checkAnime: ShikimoriGraphAnime[] = [];
        const started = Date.now();

        logger.info('[autocheck]: Getting announces from shikimori');
        let page = 1;
        do {
            const shikimoriAnimeRequest = await shikimoriApi.getGraphAnnouncesByPage(page);
            const shikimoriAnime = shikimoriAnimeRequest.data.animes;

            logger.debug(`[autocheck]: Getting announces from shikimori, page:${page}`);
            checkAnime.push(...shikimoriAnime);
            if (shikimoriAnime.length == 0 || shikimoriAnime.length < 50) break;
            page += 1;
        } while (true);

        logger.info(
            `[autocheck]: Finishing geting anime from shikimori in: ${(Date.now() - started) / 1000} seconds`
        );
        return checkAnime;
    }

    async getAnime(ids: number[]) {
        const user: undefined = undefined; // No user is required
        const shikimoriApi = new ShikimoriApiService(user);
        const idsSpliced = groupArrSplice(ids, 50);
        const started = Date.now();

        logger.info('[autocheck]: Getting anime from shikimori');

        const shikimoriRes: Promise<any>[] = idsSpliced.flatMap(async (batch) => {
            const response = await shikimoriApi.getBatchGraphAnime(batch);
            return response.data.animes;
        });

        const followedAnime: ShikimoriGraphAnime[] = await Promise.all(
            shikimoriRes.flatMap(async (p) => {
                return await p;
            })
        );

        logger.info(
            `[autocheck]: Finishing geting anime from shikimori in: ${(Date.now() - started) / 1000} seconds`
        );
        return followedAnime.flat();
    }

    async getKodikAnime(anime: ShikimoriGraphAnime[]): Promise<KodikAnimeFull[]> {
        const kodikApi = new KodikApiService();
        const animeIds: number[][] = groupArrSplice(
            anime.map((a) => {
                return a.id;
            }),
            10
        );
        const animeResult: KodikAnimeFull[] = [];
        for (const animeBatch of animeIds) {
            const kodikAnime = await kodikApi.getFullBatchAnime(animeBatch);
            animeResult.push(...(kodikAnime as KodikAnimeFull[]));
        }
        return animeResult;
    }

    async updateGroups() {
        const kodikApi = new KodikApiService();
        const translations = await kodikApi.getTranslationGroups();
        const started = Date.now();

        logger.info('[autocheck]: Began updating groups');
        for (const translation of translations) {
            await prisma.group.upsert({
                where: {
                    id: translation.id
                },
                create: {
                    id: translation.id,
                    name: translation.title,
                    type: translation.type
                },
                update: {
                    id: translation.id,
                    name: translation.title,
                    type: translation.type
                }
            });
        }

        logger.info(
            `[autocheck]: Finished updating groups in: ${(Date.now() - started) / 1000} seconds`
        );
    }

    async runAutocheck() {
        const follows = await prisma.follow.findMany({
            where: {
                status: FollowTypes.Follow
            },
            select: {
                status: true,
                userId: true,
                anime: {
                    select: {
                        shikimoriId: true
                    }
                },
                translation: true
            }
        });
        const followService = new FollowService();

        const announcements = await prisma.follow.findMany({
            where: {
                status: FollowTypes.Announcement
            },
            select: {
                status: true,
                userId: true,
                anime: {
                    select: {
                        shikimoriId: true
                    }
                }
            }
        });
        const followsMap = followService.getFollowsMap(follows);
        const announcementMap = followService.getFollowsMap(announcements);
        const followIds = [...followsMap.keys()];
        const announcementsIds = [...announcementMap.keys()];
        const defaultAnime = await this.getDefaultAnime();
        logger.debug(`[autocheck]: Got basic check anime, amount: ${defaultAnime.length}`);

        const followedAnime = await this.getAnime(followIds);
        logger.debug(`[autocheck]: Got follows, amount: ${followedAnime.length}`);

        const announcedAnime = await this.getAnnounces();
        logger.debug(`[autocheck]: Got announcements, amount: ${announcedAnime.length}`);

        logger.debug(`[autocheck]: Getting anime from kodik`);
        const kodikDefaultAnime = await this.getKodikAnime(defaultAnime);
        logger.debug(`[autocheck]: Got kodik anime, amount: ${kodikDefaultAnime.length}`);

        logger.debug(`[autocheck]: Getting anime from kodik`);
        const kodikFollowedAnime = await this.getKodikAnime(followedAnime);
        logger.debug(`[autocheck]: Got kodik anime, amount: ${kodikFollowedAnime.length}`);
        const kodikAnimeMap = new Map<number, KodikAnimeFull>();
        for (const anime of [...kodikDefaultAnime, ...kodikFollowedAnime]) {
            kodikAnimeMap.set(parseInt(anime.shikimori_id), anime);
        }
        const ids = [
            ...followIds,
            ...announcementsIds,
            ...announcedAnime.map((anime) => {
                return Number(anime.id);
            }),
            ...defaultAnime.map((anime) => {
                return Number(anime.id);
            })
        ];
        const anime = await prisma.anime.findMany({
            where: {
                shikimoriId: {
                    in: ids
                }
            },
            include: {
                animeTranslations: true
            }
        });
        const animeMap = new Map<number, animeWithTranslation>();
        for (const anim of anime) animeMap.set(anim.shikimoriId, anim);

        const checkedIds: number[] = [];
        for (const anime of [...defaultAnime, ...followedAnime, ...announcedAnime]) {
            const id = Number(anime.id);
            if (checkedIds.includes(id)) {
                continue;
            }
            let follow = followsMap.get(id);
            if (follow === undefined) {
                follow = announcementMap.get(id);
            }
            const dbAnime = animeMap.get(id);
            const kodikAnime = kodikAnimeMap.get(id);
            checkedIds.push(id);
            try {
                this.checkAnime(anime, kodikAnime, follow, dbAnime);
            } catch (error) {
                logger.error(error);
            }
        }
    }
}
