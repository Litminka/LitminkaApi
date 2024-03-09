import { Anime } from "@prisma/client";
import { prisma } from "../db";
import { AddToList, ShikimoriAnime, ShikimoriAnimeFull, ShikimoriWatchList } from "../ts";

export default class AnimeList{
    public static async updateUsersWatchList(user_id:number, anime_id: number, listEntry: ShikimoriWatchList){
        return await prisma.anime_list.updateMany({
            where: {
                AND: {
                    user_id,
                    anime_id,
                }
            },
            data: {
                status: listEntry.status,
                watched_episodes: listEntry.episodes,
                rating: listEntry.score
            }
        });
    }

    public static async createUsersWatchList(user_id: number, animeInList: Anime[], watchList: ShikimoriWatchList[]){
        await prisma.anime_list.createMany({
            data: watchList.map((listEntry) => {
                return {
                    is_favorite: false,
                    status: listEntry.status,
                    watched_episodes: listEntry.episodes,
                    user_id,
                    anime_id: animeInList.find((anime) => anime.shikimori_id == listEntry.target_id)!.id,
                    rating: listEntry.score,
                }
            })
        });
    }

    public static async addAnimeToListByIds(user_id: number, anime_id: number, parameters: AddToList){
        const { is_favorite, rating, status, watched_episodes } = parameters as AddToList;
        await prisma.anime_list.create({
            data: {
                is_favorite,
                status,
                watched_episodes,
                rating,
                anime_id,
                user_id
            }
        });
    }

    public static async updateAnimeListByAnimeId(anime_id:number, parameters: AddToList){
        const { is_favorite, rating, status, watched_episodes } = parameters as AddToList;
        await prisma.anime_list.updateMany({
            where: { anime_id},
            data: {
                is_favorite,
                status,
                watched_episodes,
                rating,
            }
        });
    }

    public static async findWatchListByIds(user_id: number, anime_id: number){
        return await prisma.anime_list.findFirst({
            where: {
                AND: {
                    user_id,
                    anime_id
                }
            }
        });
    }

    public static async removeAnimeFromListById(anime_id:number){
        await prisma.anime_list.deleteMany({
            where: { anime_id },
        });

    }

    public static async findWatchListByIdsWithAnime(user_id: number, anime_id: number){
        return await prisma.anime_list.findFirst({
            where: {
                AND: {
                    user_id,
                    anime_id
                }
            },
            include: {
                anime: true
            }
        });
    }
}