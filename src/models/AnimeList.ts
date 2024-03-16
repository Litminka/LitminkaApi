import { Anime, Prisma } from "@prisma/client";
import prisma from "../db";
import { AddToList, ShikimoriWatchList } from "../ts";

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
                        rating: listEntry.score
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
            }
        }
    }
});

export { extention as AnimeListExt }