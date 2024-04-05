import { Prisma } from "@prisma/client";
import prisma from "@/db";
import Period from "@/helper/period";
import dayjs from "dayjs";

export interface AnimeFilterBody {
    name?: string, // Complete
    includeGenres?: number[], // Complete
    excludeGenres?: number[], // Complete
    statuses?: string[], // Complete
    rpaRatings?: string[], // Complete
    mediaTypes?: string[], // Complete
    seasons?: string[], // WIP
    period?: Date[], // Complete
    isCensored: boolean, //WIP
    banInRussia?: boolean, //WIP
}

export interface AnimeFilterQuery {
    page?: number,
    pageLimit?: number
}

export default class AnimeSearchFilter {

    private static byInGenre(arg?: number[]) {
        const filter = arg?.map(genre => { return { genres: { some: { id: genre } } } })
        return (filter !== undefined) ? filter : []
    }

    private static byExGenre(arg?: number[]) {
        return (arg !== undefined) ? [{ genres: { none: { id: { in: arg } } } }] : []
    }

    private static byMediaType(arg?: string[]) {
        return (arg !== undefined) ? [{ mediaType: { in: arg } }] : []
    }

    private static byRpaRating(arg?: string[]) {
        return (arg !== undefined) ? [{ rpaRating: { in: arg } }] : []
    }

    private static byStatus(arg?: string[]) {
        return (arg !== undefined) ? [{ status: { in: arg } }] : []
    }

    private static byName(arg?: string) {
        return (arg !== undefined) ? {
            OR: [
                { name: { contains: arg } },
                { englishName: { contains: arg } },
                { franchiseName: { contains: arg } },
            ]
        } : []
    }

    private static byPeriod(arg?: Date[]) {
        const period = ((arg?: Date[] | string[]) => {
            if (arg === undefined || arg[0] === undefined)
                return Period.getPeriod([dayjs("1970-01-01").toDate(), dayjs().toDate()])
            return Period.getPeriod(arg)
        })(arg)
        return {
            OR: [
                { firstEpisodeAired: { gte: period[0] }, lastEpisodeAired: { lte: period[1] } },
                { lastEpisodeAired: { equals: dayjs("1970-01-01 00:00:00.000").toDate() } }
            ]
        }
    }

    public static async filterSelector(filterIn: AnimeFilterBody, query: AnimeFilterQuery) {
        const filters = {
            AND: [
                this.byInGenre(filterIn.includeGenres),
                this.byExGenre(filterIn.excludeGenres),
                this.byMediaType(filterIn.mediaTypes),
                this.byRpaRating(filterIn.rpaRatings),
                this.byStatus(filterIn.statuses),
                this.byPeriod(filterIn.period),
                this.byName(filterIn.name),
            ].flat().filter(filter => filter),
        }

        const { filter } = {
            filter: () => ({
                AND: filters.AND.flatMap(filter => {
                    if (filter === undefined) return []
                    return filter
                }),
            })
        } satisfies Record<string, (...args: any) => Prisma.AnimeWhereInput>;
        return prisma.anime.findMany({
            take: Number(query.pageLimit),
            skip: (Number(query.page) - 1) * Number(query.pageLimit),
            where: filter(),
            select: {
                firstEpisodeAired: true,
                lastEpisodeAired: true,
                id: true,
                englishName: true,
                name: true,
                slug: true,
                genres: true,
                shikimoriRating: true,
                rpaRating: true,
                image: true,
                mediaType: true
            }
        })
    }
}
