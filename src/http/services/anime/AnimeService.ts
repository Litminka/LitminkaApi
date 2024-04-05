import NotFoundError from "@errors/clienterrors/NotFoundError";
import AnimeUpdateService from "@services/anime/AnimeUpdateService";
import ShikimoriApiService from "@services/shikimori/ShikimoriApiService";
import prisma from "@/db";
import { UserWithIntegration } from "@/ts";
import { Prisma } from "@prisma/client";

export default class AnimeService {
    public static async getSingleAnime(animeId: number, user?: UserWithIntegration) {

        let anime = await prisma.anime.findWithTranlsationsAndGenres(animeId);
        if (!anime) throw new NotFoundError("This anime doesn't exist");
        if (!user) return anime;
        // TODO: add user role checking, and setting check to allow shikimori requests only to specific users
        if ((anime.description != null && anime.rpaRating != null)) return anime;
        const shikimoriApi = new ShikimoriApiService(user);
        const animeUpdateService = new AnimeUpdateService(shikimoriApi, user);
        const updated = await animeUpdateService.update(anime);
        if (updated) {
            anime = await prisma.anime.findWithTranlsationsAndGenres(animeId);
        }
        return anime;
    }

    public static async getTopAnime(shikimori: boolean) {
        let query: Prisma.AnimeFindManyArgs = { take: 100 }
        query.orderBy = { rating: 'desc' }
        if (shikimori) { query.orderBy = { shikimoriRating: 'desc' } }
        return await prisma.anime.findMany(query)
    }

    public static async banAnime(animeId: number) {
        await prisma.anime.updateMany({
            where: { id: animeId },
            data: {
                banned: true,
            }
        })
    }

    public static async unBanAnime(animeId: number) {
        await prisma.anime.updateMany({
            where: { id: animeId },
            data: {
                banned: false,
            }
        })
    }
}