import BadRequestError from '@/errors/clienterrors/BadRequestError';
import groupArrSplice from '@/helper/groupsplice';
import { PaginationQuery } from '@/ts';
import { AddToList, WatchListFilters } from '@/ts/watchList';
import { ShikimoriAnime, ShikimoriWatchList } from '@/ts/shikimori';
import { UserWithIntegration, UserWithIntegrationSettings } from '@/ts/user';
import AnimeUpdateService from '@services/anime/AnimeUpdateService';
import KodikApiService from '@services/KodikApiService';
import ShikimoriApiService from '@services/shikimori/ShikimoriApiService';
import { ShikimoriAnimeOptionalRelation, ShikimoriAnimeWithRelation } from '@/ts/shikimori';
import { KodikAnime } from '@/ts/kodik';
import { logger } from '@/loggerConf';
import prisma from '@/db';
import { Anime, Prisma } from '@prisma/client';
import { watchListImportQueue } from '@/queues/queues';
import ShikimoriListSyncService from '@services/shikimori/ShikimoriListSyncService';

export default class WatchListService {
    private static getFilters(userId: number, filters: WatchListFilters) {
        const { statuses, ratings, isFavorite } = filters as WatchListFilters;
        const { filter } = {
            filter: () => {
                return {
                    AND: {
                        userId,
                        isFavorite,
                        status: statuses === undefined ? undefined : { in: statuses },
                        rating:
                            ratings === undefined ? undefined : (
                                {
                                    gte: ratings ? ratings[0] : 1,
                                    lte: ratings ? ratings[1] : 10
                                }
                            )
                    }
                };
            }
        } satisfies Record<string, (...args: any) => Prisma.AnimeListWhereInput>;
        return filter();
    }

    public static async _findWatchlistEntry(userId: number, animeId: number) {
        return await prisma.animeList.findFirst({
            where: { userId, animeId }
        });
    }

    public static async _getCount(userId: number, filters: WatchListFilters) {
        const { _count } = await prisma.animeList.aggregate({
            _count: {
                id: true
            },
            where: this.getFilters(userId, filters)
        });
        return _count.id;
    }

    /**
     * @deprecated prefer using import
     * @param id
     */
    public static async importListByUser(id: number) {
        // Get current user
        const user = await prisma.user.findUserByIdWithIntegration(id);
        const shikimoriapi = new ShikimoriApiService(user);
        const animeList = await shikimoriapi.getUserList();
        logger.info('Got list');
        let watchList: ShikimoriWatchList[] = animeList as ShikimoriWatchList[];
        const shikimoriAnimeIds: number[] = watchList.map((anime) => {
            return anime.target_id;
        });

        // Get all anime from kodik
        const kodik = new KodikApiService();
        const result = await kodik.getFullBatchAnime(shikimoriAnimeIds);

        logger.info('Got anime from kodik');

        // Isolate all results that returned nothing
        const kodikIds = result.map((anime) => {
            return parseInt(anime.shikimori_id);
        });
        const noResultIds = shikimoriAnimeIds.filter((id) => {
            return kodikIds.indexOf(id) < 0;
        });

        // Request all isolated ids from shikimori
        // Splice all ids into groups of 50, so we can batch request anime from shikimori
        const idsSpliced = groupArrSplice(noResultIds, 50);
        const shikimoriRes: Promise<any>[] = idsSpliced.flatMap(async (batch) => {
            return await shikimoriapi.getBatchAnime(batch);
        });
        let noResultAnime: ShikimoriAnime[] = await Promise.all(
            shikimoriRes.flatMap(async (p) => {
                return await p;
            })
        );
        noResultAnime = noResultAnime.flat();

        // remove all nasty stuff from watchlist, no pron for you >:)
        const allIds = new Set([
            ...kodikIds,
            ...noResultAnime.map((anime) => {
                return anime.id;
            })
        ]);
        watchList = watchList.filter((list) => {
            return allIds.has(list.target_id);
        });

        const animeUpdateService = new AnimeUpdateService(shikimoriapi, user);
        let animeInList = await animeUpdateService.updateAnimeKodik(result);
        const shikimoriUpdate = await animeUpdateService.updateAnimeShikimori(noResultAnime);

        animeInList = animeInList.concat(shikimoriUpdate);
        for (let i = 0; i < watchList.length; i++) {
            const listEntry = watchList[i];
            const animeId = animeInList.find((anime) => {
                return anime.shikimoriId == listEntry.target_id;
            })!.id;
            const res = await prisma.animeList.updateUserWatchListEntry(
                user.id,
                animeId,
                listEntry
            );
            // if were updated, remove from array, to prevent inserting
            // prisma does not have upsert many, so we remove updated titles
            const { count } = res;
            if (count > 0) watchList.splice(i--, 1);
        }
        await prisma.animeList.createWatchListEntry(user.id, animeInList, watchList);
    }

    public static startImport(user: UserWithIntegration) {
        if (!user.integration || !user.integration.shikimoriId)
            throw new BadRequestError('no_shikimori_integration');

        watchListImportQueue.add(
            'watchListImport',
            { id: user.id },
            {
                removeOnComplete: 10,
                removeOnFail: 100
            }
        );
    }

    public static async import(id: number) {
        const user = await prisma.user.findUserById(id, {
            integration: true,
            shikimoriLink: true
        });
        const shikimoriApi = new ShikimoriApiService(user);
        const kodikApi = new KodikApiService();

        const watchList = await shikimoriApi.getUserList();
        logger.info(`Got list of user ID:${user.id}:${user.login}`);

        const watchListAnimeIds: number[] = watchList.map((anime) => {
            return anime.target_id;
        });
        const groupedIds = groupArrSplice(watchListAnimeIds, 50);

        let batchNumber = 1;
        const shikimoriMap = new Map<number, ShikimoriAnimeOptionalRelation>();
        const kodikMap = new Map<number, KodikAnime>();
        const noKodikSet = new Set<number>();

        for (const batch of groupedIds) {
            logger.info(`Requesting anime from watchList, batch:${batchNumber}`);
            const shikimoriData = await shikimoriApi.getBatchGraphAnime(batch);

            for (const anime of shikimoriData.data.animes) {
                shikimoriMap.set(Number(anime.id), anime);

                anime.related = anime.related.filter((relation) => {
                    return relation.anime !== null;
                });

                for (const relation of anime.related) {
                    const id = Number(relation.anime!.id);

                    if (shikimoriMap.has(id)) continue; // prefer anime with relations

                    shikimoriMap.set(id, relation.anime!);

                    noKodikSet.add(id);
                }
            }
            const kodikData = await kodikApi.getBatchAnime(batch);

            for (const kodikAnime of kodikData) {
                kodikMap.set(Number(kodikAnime.shikimori_id), kodikAnime);
            }

            batchNumber++;
        }

        batchNumber = 0;

        const translationBatch = groupArrSplice([...noKodikSet], 50);
        for (const batch of translationBatch) {
            logger.info(`Requesting additional anime from kodik, batch:${batchNumber}`);
            const kodikData = await kodikApi.getBatchAnime(batch);

            for (const kodikAnime of kodikData) {
                kodikMap.set(Number(kodikAnime.shikimori_id), kodikAnime);
            }

            batchNumber++;
        }

        const shikimoriBatchIds: number[][] = groupArrSplice([...shikimoriMap.keys()], 100);
        const writeRelations = new Map<number, ShikimoriAnimeWithRelation>();
        const shikimoriDBAnimeMap = new Map<number, number>();
        for (const batch of shikimoriBatchIds) {
            const animeBatch = await prisma.anime.getBatchAnimeShikimori(batch);
            const animeMap = new Map<number, Anime>();
            for (const anime of animeBatch) {
                animeMap.set(anime.shikimoriId, anime);
            }

            for (const id of batch) {
                const shikimoriAnime = shikimoriMap.get(id);
                const kodikAnime = kodikMap.get(id);
                const anime = animeMap.get(id);

                if (anime !== undefined) {
                    if (
                        !anime.hasRelation &&
                        shikimoriAnime!.related !== undefined &&
                        shikimoriAnime!.related.length > 0
                    ) {
                        writeRelations.set(id, shikimoriAnime! as ShikimoriAnimeWithRelation);
                    }

                    let hasRelation = false;
                    if (shikimoriAnime!.related?.length) {
                        hasRelation = true;
                    }
                    await prisma.anime.updateFromShikimoriGraph(
                        shikimoriAnime!,
                        hasRelation,
                        anime,
                        kodikAnime
                    );
                    shikimoriDBAnimeMap.set(Number(shikimoriAnime!.id), anime.id);
                    continue;
                }

                const related = shikimoriAnime?.related;
                let hasRelation = false;
                if (related && related.length > 0) {
                    hasRelation = true;
                }
                const newAnime = await prisma.anime.createFromShikimoriGraph(
                    shikimoriAnime!,
                    hasRelation,
                    kodikAnime
                );
                shikimoriDBAnimeMap.set(Number(shikimoriAnime!.id), newAnime.id);
                if (hasRelation)
                    writeRelations.set(id, shikimoriAnime! as ShikimoriAnimeWithRelation);
            }
        }
        await prisma.animeRelation.createFromShikimoriMap(writeRelations);
        await prisma.animeList.createEntriesFromShikimoriList(
            user.id,
            shikimoriDBAnimeMap,
            watchList
        );
    }

    public static async delete(user: UserWithIntegrationSettings, animeId: number) {
        const animeListEntry = await this._findWatchlistEntry(user.id, animeId);

        if (animeListEntry !== null && animeListEntry.shikimoriId !== null) {
            ShikimoriListSyncService.createDeleteJob(user, animeListEntry.shikimoriId);
        }

        await prisma.animeList.deleteMany({
            where: { userId: user.id, animeId }
        });
    }

    public static async edit(
        user: UserWithIntegrationSettings,
        animeId: number,
        editParameters: AddToList
    ) {
        const { shikimoriId, maxEpisodes } = await prisma.anime.findFirstOrThrow({
            where: {
                id: animeId
            },
            select: {
                shikimoriId: true,
                maxEpisodes: true
            }
        });

        if (editParameters.watchedEpisodes > maxEpisodes)
            editParameters.watchedEpisodes = maxEpisodes;

        await prisma.animeList.upsertWatchlistEntry(user.id, animeId, editParameters);

        ShikimoriListSyncService.createAddUpdateJob(user, {
            animeId: shikimoriId,
            episodes: editParameters.watchedEpisodes,
            status: editParameters.status,
            score: editParameters.rating === 0 ? undefined : editParameters.rating
        });

        return await this._findWatchlistEntry(user.id, animeId);
    }

    public static async get(userId: number, filters: WatchListFilters, query: PaginationQuery) {
        const count = await this._getCount(userId, filters);
        const list = await prisma.animeList.findMany({
            take: query.pageLimit,
            skip: (query.page - 1) * query.pageLimit,
            where: this.getFilters(userId, filters),
            include: {
                anime: {
                    select: {
                        id: true,
                        slug: true,
                        image: true,
                        name: true,
                        status: true,
                        rpaRating: true,
                        shikimoriId: true,
                        rating: true,
                        shikimoriRating: true,
                        mediaType: true,
                        currentEpisodes: true,
                        maxEpisodes: true,
                        season: true
                    }
                }
            }
        });

        return { count, list };
    }
}
