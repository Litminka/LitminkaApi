import prisma from '@/db';
import AnimeSearchService from '@services/anime/AnimeSearchService';
import { AnimePgaRatings } from '@enums';
import { getCurrentSeason, getNextSeason } from '@/helper/animeseason';

export default class AnimeService {
    public static async getSingleAnime(slug: string, userId?: number) {
        return await prisma.anime.findWithTranlsationsAndGenres(slug, userId);
    }

    public static async getGenres() {
        return await prisma.genre.findMany({
            orderBy: { name: 'asc' },
            select: {
                id: true,
                name: true,
                nameRussian: true,
                kind: true
            }
        });
    }

    public static async getTopAnime(
        withCensored: boolean,
        withBanned: boolean,
        byShikimoriRating: boolean
    ) {
        return AnimeSearchService.filterShortSelector(
            {
                isWatchable: true,
                withCensored,
                withBanned,
                rpaRatings:
                    !withCensored ?
                        [
                            AnimePgaRatings.None,
                            AnimePgaRatings.G,
                            AnimePgaRatings.PG,
                            AnimePgaRatings.PG_13
                        ]
                    :   undefined
            },
            { page: 1, pageLimit: 100 },
            byShikimoriRating ? { shikimoriRating: 'desc' } : { rating: 'desc' }
        );
    }

    public static async getSeasonal(
        withCensored: boolean,
        isWatchable: boolean,
        withBanned: boolean
    ) {
        return AnimeSearchService.filterShortSelector(
            {
                isWatchable,
                withCensored,
                seasons: [getCurrentSeason()],
                withBanned,
                rpaRatings:
                    !withCensored ?
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

    public static async getPopularSeasonal(
        withCensored: boolean,
        isWatchable: boolean,
        withBanned: boolean
    ) {
        return AnimeSearchService.filterShortSelector(
            {
                isWatchable,
                withCensored,
                withBanned,
                seasons: [getCurrentSeason()],
                rpaRatings:
                    !withCensored ?
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

    public static async getNextSeasonAnnounced(withCensored: boolean, withBanned: boolean) {
        return AnimeSearchService.filterShortSelector(
            {
                isWatchable: false,
                seasons: [getNextSeason(new Date())],
                statuses: ['announced'],
                withCensored,
                withBanned,
                rpaRatings:
                    !withCensored ?
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
            data: { banned: true }
        });
    }

    public static async unBanAnime(animeId: number) {
        await prisma.anime.updateMany({
            where: { id: animeId },
            data: { banned: false }
        });
    }
}
