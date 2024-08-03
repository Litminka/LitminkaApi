import { Prisma } from '@prisma/client';
import prisma from '@/db';
import Period from '@/helper/period';
import dayjs from 'dayjs';
import { PaginationQuery } from '@/ts';
import { getSeasonPeriod } from '@/helper/animeseason';

export interface AnimeFilterBody {
    name?: string;
    includeGenres?: number[];
    excludeGenres?: number[];
    statuses?: string[];
    rpaRatings?: string[];
    mediaTypes?: string[];
    seasons?: string[];
    period?: Date[];
    banInRussia?: boolean;
    withCensored: boolean;
    isWatchable: boolean;
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

    private static isCensored(arg: boolean) {
        return !arg ? { censored: arg } : undefined;
    }

    private static isWatchable(arg?: boolean) {
        return arg ? { kodikLink: { not: null } } : undefined;
    }

    private static byPeriod(arg?: Date[]) {
        if (arg === undefined || arg.length < 1) return [];
        const period = ((arg?: Date[] | string[]) => {
            if (arg![0] === undefined)
                return Period.getPeriod([dayjs('1970-01-01').toDate(), dayjs().toDate()]);
            return Period.getPeriod(arg);
        })(arg);
        return {
            OR: [
                {
                    firstEpisodeAired: { gte: period[0] },
                    lastEpisodeAired: { lte: period[1] }
                },
                {
                    lastEpisodeAired: {
                        equals: dayjs('1970-01-01 00:00:00.000').toDate()
                    }
                }
            ]
        };
    }

    private static byBan(arg?: boolean) {
        return !arg ? { banned: arg } : undefined;
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
                this.isCensored(filters.withCensored),
                this.isWatchable(filters.isWatchable),
                this.byBan(filters.banInRussia)
            ]
                .flat()
                .filter((filter) => {
                    return filter;
                })
        };

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
        order?: Prisma.AnimeFindManyArgs['orderBy']
    ) {
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
            orderBy: order
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
