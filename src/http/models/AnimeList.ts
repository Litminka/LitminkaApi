import { Anime, Prisma } from '@prisma/client';
import prisma from '@/db';
import { AddToList, ShikimoriWatchList } from '@/ts';

const extention = Prisma.defineExtension({
    name: 'AnimeListModel',
    model: {
        animeList: {
            /**
             * @deprecated prefer using createWatchListEntries instead
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
            async createWatchListEntries(
                userId: number,
                animeMap: Map<number, number>,
                watchList: ShikimoriWatchList[]
            ) {
                await prisma.animeList.createMany({
                    data: watchList.map((listEntry) => {
                        return {
                            isFavorite: false,
                            status: listEntry.status,
                            watchedEpisodes: listEntry.episodes,
                            userId,
                            animeId: animeMap.get(Number(listEntry.target_id))!,
                            rating: listEntry.score,
                            shikimoriId: listEntry.id
                        } satisfies Prisma.AnimeListCreateManyInput;
                    })
                });
            },
            async addWatchListEntry(userId: number, animeId: number, parameters: AddToList) {
                const { isFavorite, rating, status, watchedEpisodes } = parameters as AddToList;
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
            async updateWatchListEntry(userId: number, animeId: number, parameters: AddToList) {
                const { isFavorite, rating, status, watchedEpisodes } = parameters as AddToList;
                await prisma.animeList.updateMany({
                    where: { userId, animeId },
                    data: {
                        isFavorite,
                        status,
                        watchedEpisodes,
                        rating
                    }
                });
            },
            async findWatchListEntry(userId: number, animeId: number) {
                return await prisma.animeList.findFirst({
                    where: { AND: { userId, animeId } }
                });
            },
            async removeWatchListEntry(userId: number, animeId: number) {
                await prisma.animeList.deleteMany({
                    where: { userId, animeId }
                });
            },
            async getListLengthByUserId(userId: number) {
                const list = await prisma.animeList.aggregate({
                    where: { userId },
                    _count: {
                        id: true
                    }
                });
                return list._count;
            }
        }
    }
});

export { extention as AnimeListExt };
