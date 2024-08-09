import { Prisma } from '@prisma/client';
import prisma from '@/db';
import Period from '@/helper/period';
import dayjs from 'dayjs';
import { PaginationQuery } from '@/ts';
import { getSeasonPeriod } from '@/helper/animeseason';
import { logger } from '@/loggerConf';

export interface AnimeFilterBody {
    name?: string;
    includeGenres?: number[];
    excludeGenres?: number[];
    statuses?: string[];
    rpaRatings?: string[];
    mediaTypes?: string[];
    seasons?: string[];
    period?: Date[];
    withBanned: boolean;
    withCensored?: boolean;
    isWatchable?: boolean;
}

export default class AnimeSearchService {
    private static byInGenre(arg?: number[]) {
        const filter = arg?.map((genre) => {
            return { genres: { some: { id: genre } } };
        });
        return filter !== undefined ? filter : [];
    }

    private static byExGenre(arg?: number[]) {
        return arg !== undefined ? [{ genres: { none: { id: { in: arg } } } }] : [];
    }

    private static byMediaType(arg?: string[]) {
        return arg !== undefined ? [{ mediaType: { in: arg } }] : [];
    }

    private static byRpaRating(arg?: string[]) {
        return arg !== undefined ? [{ rpaRating: { in: arg } }] : [];
    }

    private static byStatus(arg?: string[]) {
        return arg !== undefined ? [{ status: { in: arg } }] : [];
    }

    private static bySeasons(arg?: string[]) {
        if (arg === undefined) return [];
        return arg !== undefined ? [{ season: { in: getSeasonPeriod(arg) } }] : [];
    }

    private static byName(arg?: string) {
        return arg !== undefined ?
                {
                    OR: [
                        { name: { contains: arg, mode: Prisma.QueryMode.insensitive } },
                        { englishName: { contains: arg, mode: Prisma.QueryMode.insensitive } },
                        { franchiseName: { contains: arg, mode: Prisma.QueryMode.insensitive } }
                    ]
                }
            :   [];
    }

    /**
     *
     * @param arg
     * @returns
     */
    private static byPeriod(arg?: Date[]) {
        if (arg === undefined) return [];
        const period = Period.validatePeriod(arg);

        return {
            OR: [
                {
                    firstEpisodeAired: { gte: period[0] },
                    lastEpisodeAired: { lte: period[1] }
                },
                {
                    // Fix for unreleased titles without lastEpisodeAired
                    lastEpisodeAired: {
                        equals: dayjs(0).toDate()
                    }
                }
            ]
        };
    }

    private static isWatchable(arg?: boolean) {
        if (typeof arg === 'boolean')
            return arg ? { kodikLink: { not: null } } : { kodikLink: null };
        return undefined;
    }

    private static withBanned(arg?: boolean) {
        return !arg ? { banned: false } : undefined;
    }

    private static withCensored(arg?: boolean) {
        return !arg ? { censored: false } : undefined;
    }

    private static generateFilters(filters: AnimeFilterBody) {
        const andFilter = {
            AND: [
                this.byInGenre(filters.includeGenres),
                this.byExGenre(filters.excludeGenres),
                this.byMediaType(filters.mediaTypes),
                this.byRpaRating(filters.rpaRatings),
                this.byStatus(filters.statuses),
                this.byPeriod(filters.period),
                this.byName(filters.name),
                this.bySeasons(filters.seasons),
                this.isWatchable(filters.isWatchable),
                this.withCensored(filters.withCensored),
                this.withBanned(filters.withBanned)
            ]
                .flat()
                .filter((filter) => {
                    return filter;
                })
        };

        logger.debug(`Search anime with filters: ${JSON.stringify(andFilter.AND, null, 4)}`);
        const { filter } = {
            filter: () => {
                return {
                    AND: andFilter.AND.flatMap((filter) => {
                        if (filter === undefined) return [];
                        return filter;
                    })
                };
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } satisfies Record<string, (...args: any) => Prisma.AnimeWhereInput>;
        return filter();
    }

    public static async getFilteredCount(filters: AnimeFilterBody) {
        const anime = await prisma.anime.aggregate({
            where: this.generateFilters(filters),
            _count: {
                id: true
            }
        });
        return anime._count.id;
    }

    public static async filterSelector(
        filters: AnimeFilterBody,
        query: PaginationQuery,
        orderBy?: Prisma.AnimeFindManyArgs['orderBy']
    ) {
        orderBy = orderBy ?? { name: 'asc' };
        return await prisma.anime.findMany({
            take: query.pageLimit,
            skip: (query.page - 1) * query.pageLimit,
            where: this.generateFilters(filters),
            select: {
                firstEpisodeAired: true,
                lastEpisodeAired: true,
                id: true,
                englishName: true,
                name: true,
                slug: true,
                genres: true,
                shikimoriRating: true,
                rating: true,
                shikimoriId: true,
                rpaRating: true,
                image: true,
                mediaType: true,
                description: true
            },
            orderBy
        });
    }

    public static async filterShortSelector(
        filters: AnimeFilterBody,
        query: PaginationQuery,
        order?: Prisma.AnimeFindManyArgs['orderBy']
    ) {
        return await prisma.anime.findMany({
            take: query.pageLimit,
            skip: (query.page - 1) * query.pageLimit,
            where: this.generateFilters(filters),
            select: {
                id: true,
                slug: true,
                image: true,
                name: true,
                status: true,
                rpaRating: true,
                shikimoriId: true,
                rating: true,
                mediaType: true
            },
            orderBy: order
        });
    }
}
