import { Anime, Prisma } from '@prisma/client';
import prisma from '@/db';
import { AddToList } from '@/ts/watchList';
import { ShikimoriWatchList } from '@/ts/shikimori';
import WatchListService from '../services/WatchListService';
import { logger } from '@/loggerConf';

const extention = Prisma.defineExtension({
    name: 'AnimeListModel',
    model: {
        animeList: {
            /**
             * @deprecated prefer using createEntriesFromShikimoriList instead
             * @param userId
             * @param dbAnime
             * @param watchList
             */
            async createWatchListEntry(
                userId: number,
                dbAnime: Anime[],
                watchList: ShikimoriWatchList[]
            ) {
                await prisma.animeList.createMany({
                    data: watchList.map((listEntry) => {
                        return {
                            isFavorite: false,
                            status: listEntry.status,
                            watchedEpisodes: listEntry.episodes,
                            userId,
                            animeId: dbAnime.find((anime) => {
                                return anime.shikimoriId == listEntry.target_id;
                            })!.id,
                            rating: listEntry.score,
                            shikimoriId: listEntry.id
                        } satisfies Prisma.AnimeListCreateManyInput;
                    })
                });
            },

            /**
             *
             * @deprecated prefer using updateWatchListEntry
             * @param userId
             * @param animeId
             * @param listEntry
             * @returns
             */
            async updateUserWatchListEntry(
                userId: number,
                animeId: number,
                listEntry: ShikimoriWatchList
            ) {
                return await prisma.animeList.updateMany({
                    where: { userId, animeId },
                    data: {
                        status: listEntry.status,
                        watchedEpisodes: listEntry.episodes,
                        rating: listEntry.score,
                        shikimoriId: listEntry.id
                    }
                });
            },

            /**
             * Used for watchlist import from shikimori
             * @param userId
             * @param animeMap
             * @param watchList
             */
            async createEntriesFromShikimoriList(
                userId: number,
                animeMap: Map<number, number>,
                watchList: ShikimoriWatchList[]
            ) {
                const prismaData = [];
                const localWatchList = await prisma.animeList.findMany({
                    where: {
                        userId,
                        animeId: { in: Array.from(animeMap.values()) }
                    }
                });

                const watchListMap = new Map(
                    localWatchList.map((entry) => {
                        return [entry.id, entry];
                    })
                );

                for (const shikimoriEntry of watchList) {
                    const animeId = Number(shikimoriEntry.target_id);
                    const localEntry = watchListMap.get(animeMap.get(animeId)!);

                    if (localEntry) {
                        await prisma.animeList.updateMany({
                            where: {
                                userId,
                                animeId
                            },
                            data: {
                                isFavorite: false,
                                status: shikimoriEntry.status,
                                watchedEpisodes: shikimoriEntry.episodes,
                                userId,
                                animeId,
                                rating: shikimoriEntry.score,
                                shikimoriId: shikimoriEntry.id
                            }
                        });
                        continue;
                    }

                    prismaData.push({
                        isFavorite: false,
                        status: shikimoriEntry.status,
                        watchedEpisodes: shikimoriEntry.episodes,
                        userId,
                        animeId,
                        rating: shikimoriEntry.score,
                        shikimoriId: shikimoriEntry.id
                    } satisfies Prisma.AnimeListCreateManyInput);
                }

                await prisma.animeList.createMany({
                    data: prismaData
                });
            },

            async upsertWatchlistEntry(userId: number, animeId: number, parameters: AddToList) {
                const { isFavorite, rating, status, watchedEpisodes } = parameters as AddToList;
                const animeListEntry = await WatchListService._findWatchlistEntry(userId, animeId);

                if (animeListEntry) {
                    await prisma.animeList.updateMany({
                        where: { userId, animeId },
                        data: {
                            isFavorite,
                            status,
                            watchedEpisodes,
                            rating
                        }
                    });
                } else {
                    await prisma.animeList.create({
                        data: {
                            isFavorite,
                            status,
                            watchedEpisodes,
                            rating,
                            animeId,
                            userId
                        }
                    });
                }
            }
        }
    }
});

export { extention as AnimeListExt };
