import prisma from '@/db';
import { Prisma } from '@prisma/client';
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

    public static async getTopAnime(shikimori: boolean) {
        const query: Prisma.AnimeFindManyArgs = { take: 100 };
        query.orderBy = { rating: 'desc' };
        if (shikimori) {
            query.orderBy = { shikimoriRating: 'desc' };
        }
        return await prisma.anime.findMany(query);
    }

    public static async getSeasonal(censor: boolean, watchable: boolean, showBanned: boolean) {
        return AnimeSearchService.filterShortSelector(
            {
                isWatchable: watchable,
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

    public static async getPopularSeasonal(
        censor: boolean,
        watchable: boolean,
        showBanned: boolean
    ) {
        return AnimeSearchService.filterShortSelector(
            {
                isWatchable: watchable,
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

    public static async getNextSeasonAnnounced(
        censor: boolean,
        watchable: boolean,
        showBanned: boolean
    ) {
        return AnimeSearchService.filterShortSelector(
            {
                isWatchable: watchable,
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
