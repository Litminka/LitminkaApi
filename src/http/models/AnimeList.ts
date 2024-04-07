import { Anime, Prisma } from "@prisma/client";
import prisma from "@/db";
import { AddToList, ShikimoriWatchList, ListFilters } from "@/ts";

const extention = Prisma.defineExtension({
    name: "AnimeListModel",
    model: {
        animeList: {
            async updateUsersWatchList(userId: number, animeId: number, listEntry: ShikimoriWatchList) {
                return await prisma.animeList.updateMany({
                    where: {
                        userId,
                        animeId,
                    },
                    data: {
                        status: listEntry.status,
                        watchedEpisodes: listEntry.episodes,
                        rating: listEntry.score,
                        shikimoriId: listEntry.id,
                    }
                });
            },
            /**
             * @deprecated prefer using createUserWatchListByMap instead
             * @param userId 
             * @param dbAnime 
             * @param watchList 
             */
            async createUserWatchList(userId: number, dbAnime: Anime[], watchList: ShikimoriWatchList[]) {
                await prisma.animeList.createMany({
                    data: watchList.map((listEntry) => {
                        return {
                            isFavorite: false,
                            status: listEntry.status,
                            watchedEpisodes: listEntry.episodes,
                            userId,
                            animeId: dbAnime.find((anime) => anime.shikimoriId == listEntry.target_id)!.id,
                            rating: listEntry.score,
                            shikimoriId: listEntry.id,
                        } satisfies Prisma.AnimeListCreateManyInput
                    })
                });
            },
            async createUserWatchListByMap(userId: number, animeMap: Map<number, number>, watchList: ShikimoriWatchList[]) {
                await prisma.animeList.createMany({
                    data: watchList.map((listEntry) => {
                        return {
                            isFavorite: false,
                            status: listEntry.status,
                            watchedEpisodes: listEntry.episodes,
                            userId,
                            animeId: animeMap.get(Number(listEntry.target_id))!,
                            rating: listEntry.score,
                            shikimoriId: listEntry.id,
                        } satisfies Prisma.AnimeListCreateManyInput
                    })
                });
            },
            async addAnimeToListByIds(userId: number, animeId: number, parameters: AddToList) {
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
            async updateAnimeListByAnimeId(animeId: number, parameters: AddToList) {
                const { isFavorite, rating, status, watchedEpisodes } = parameters as AddToList;
                await prisma.animeList.updateMany({
                    where: { animeId },
                    data: {
                        isFavorite,
                        status,
                        watchedEpisodes,
                        rating,
                    }
                });
            },
            async findWatchListByIds(userId: number, animeId: number) {
                return await prisma.animeList.findFirst({
                    where: {
                        AND: {
                            userId,
                            animeId
                        }
                    }
                });
            },
            async removeAnimeFromListById(animeId: number) {
                await prisma.animeList.deleteMany({
                    where: { animeId },
                });

            },
            async findWatchListByIdsWithAnime(userId: number, animeId: number) {
                return await prisma.animeList.findFirst({
                    where: {
                        userId, animeId
                    },
                    include: {
                        anime: true
                    }
                });
            },
            async getListLengthByUserId(userId: number) {
                const list = await prisma.animeList.aggregate({
                    where: { userId},
                    _count: {
                        id: true
                    }
                })
                return list._count;
            },
            async findFilteredWatchList(userId:number, filters: ListFilters, page: number){
                const { statuses, ratings, isFavorite } = filters as ListFilters;
                const statusFilter = {
                    in: statuses
                }
                const ratingFilter = {
                    gte: ratings ? ratings[0] : 1,
                    lte: ratings ? ratings[1] : 10
                }
                return await prisma.animeList.findMany({
                    take: 200,
                    where: {
                        userId, 
                        rating: ratings === undefined ? undefined : ratingFilter, 
                        isFavorite, 
                        status: statuses === undefined ? undefined : statusFilter
                    },
                    include: {
                        anime: true
                    }
                });
            }
        }
    }
});

export { extention as AnimeListExt }