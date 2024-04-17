import NotFoundError from '@/errors/clienterrors/NotFoundError';
import AnimeUpdateService from '@services/anime/AnimeUpdateService';
import ShikimoriApiService from '@services/shikimori/ShikimoriApiService';
import prisma from '@/db';
import { UserWithIntegration } from '@/ts/user';
import { Prisma } from '@prisma/client';
import AnimeSearchService from '@services/anime/AnimeSearchService';
import { AnimePgaRatings } from '@enums';
import { getCurrentSeason, getNextSeason } from '@/helper/animeseason';

export default class AnimeService {
    public static async getSingleAnime(slug: string, user?: UserWithIntegration) {
        let anime = await prisma.anime.findWithTranlsationsAndGenres(slug);
        if (!anime) throw new NotFoundError("This anime doesn't exist");
        if (!user) return anime;
        // TODO: add user role checking, and setting check to allow shikimori requests only to specific users
        if (anime.description != null && anime.rpaRating != null) return anime;
        const shikimoriApi = new ShikimoriApiService(user);
        const animeUpdateService = new AnimeUpdateService(shikimoriApi, user);
        const updated = await animeUpdateService.update(anime);
        if (updated) {
            anime = await prisma.anime.findWithTranlsationsAndGenres(slug);
        }
        return anime;
    }

    public static async getGenres() {
        const query: Prisma.GenreFindManyArgs = {
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                nameRussian: true,
                kind: true
            }
        };
        return await prisma.genre.findMany(query);
    }

    public static async getTopAnime(shikimori: boolean) {
        const query: Prisma.AnimeFindManyArgs = { take: 100 };
        query.orderBy = { rating: 'desc' };
        if (shikimori) {
            query.orderBy = { shikimoriRating: 'desc' };
        }
        return await prisma.anime.findMany(query);
    }

    public static async getSeasonal(censor: boolean, showBanned: boolean) {
        return AnimeSearchService.filterShortSelector(
            {
                withCensored: censor,
                seasons: [getCurrentSeason()],
                banInRussia: showBanned,
                rpaRatings:
                    !censor ?
                        [
                            AnimePgaRatings.None,
                            AnimePgaRatings.G,
                            AnimePgaRatings.PG,
                            AnimePgaRatings.PG_13
                        ]
                    :   undefined
            },
            { page: 1, pageLimit: 30 }
        );
    }

    public static async getPopularSeasonal(censor: boolean, showBanned: boolean) {
        return AnimeSearchService.filterShortSelector(
            {
                withCensored: censor,
                seasons: [getCurrentSeason()],
                banInRussia: showBanned,
                rpaRatings:
                    !censor ?
                        [
                            AnimePgaRatings.None,
                            AnimePgaRatings.G,
                            AnimePgaRatings.PG,
                            AnimePgaRatings.PG_13
                        ]
                    :   undefined
            },
            { page: 1, pageLimit: 5 },
            { rating: 'desc' }
        );
    }

    public static async getNextSeasonAnnounced(censor: boolean, showBanned: boolean) {
        return AnimeSearchService.filterShortSelector(
            {
                withCensored: censor,
                seasons: [getNextSeason(new Date())],
                statuses: ['announced'],
                banInRussia: showBanned,
                rpaRatings:
                    !censor ?
                        [
                            AnimePgaRatings.None,
                            AnimePgaRatings.G,
                            AnimePgaRatings.PG,
                            AnimePgaRatings.PG_13
                        ]
                    :   undefined
            },
            { page: 1, pageLimit: 30 }
        );
    }

    public static async banAnime(animeId: number) {
        await prisma.anime.updateMany({
            where: { id: animeId },
            data: {
                banned: true
            }
        });
    }

    public static async unBanAnime(animeId: number) {
        await prisma.anime.updateMany({
            where: { id: animeId },
            data: {
                banned: false
            }
        });
    }
}
