import { Anime, Prisma } from "@prisma/client";
import { prisma } from "../db";
import { AddToList, ShikimoriAnime, ShikimoriAnimeFull, ShikimoriWatchList } from "../ts";

export default class AnimeList {
    public static async updateUsersWatchList(userId: number, animeId: number, listEntry: ShikimoriWatchList) {
        return await prisma.animeList.updateMany({
            where: {
                AND: {
                    userId,
                    animeId,
                }
            },
            data: {
                status: listEntry.status,
                watchedEpisodes: listEntry.episodes,
                rating: listEntry.score
            }
        });
    }

    public static async createUsersWatchList(userId: number, animeInList: Anime[], watchList: ShikimoriWatchList[]) {
        await prisma.animeList.createMany({
            data: watchList.map((listEntry) => {
                return {
                    isFavorite: false,
                    status: listEntry.status,
                    watchedEpisodes: listEntry.episodes,
                    userId,
                    animeId: animeInList.find((anime) => anime.shikimoriId == listEntry.target_id)!.id,
                    rating: listEntry.score,
                } satisfies Prisma.AnimeListCreateManyInput
            })
        });
    }

    public static async addAnimeToListByIds(userId: number, animeId: number, parameters: AddToList) {
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
    }

    public static async updateAnimeListByAnimeId(animeId: number, parameters: AddToList) {
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
    }

    public static async findWatchListByIds(userId: number, animeId: number) {
        return await prisma.animeList.findFirst({
            where: {
                AND: {
                    userId,
                    animeId
                }
            }
        });
    }

    public static async removeAnimeFromListById(animeId: number) {
        await prisma.animeList.deleteMany({
            where: { animeId },
        });

    }

    public static async findWatchListByIdsWithAnime(userId: number, animeId: number) {
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