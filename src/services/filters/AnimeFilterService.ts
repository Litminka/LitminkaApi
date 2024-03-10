import { Prisma } from "@prisma/client";
import prisma from "../../db";
import { logger } from "../../loggerConf";
import Period from "../../helper/period";
import dayjs from "dayjs";

interface IAnimeFilterService {
    years?: Date[], // WIP
    period?: Date[], // Complete
    seasons?: string[], // WIP
    includeGenres?: number[], // Complete
    excludeGenres?: number[], // Complete
    name?: string, // Complete
    statuses?: string[], // Complete
    rpaRatings?: string[], // Complete
    mediaTypes?: string[] // Complete
}

export default class AnimeFilterService {

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
        return (arg !== undefined) ? [{ name: { contains: arg } }] : []
    }

    private static byEnglishName(arg?: string) {
        return (arg !== undefined) ? [{ englishName: { contains: arg } }] : []
    }

    private static byFranchiseName(arg?: string) {
        return (arg !== undefined) ? [{ franchiseName: { contains: arg } }] : []
    }

    private static byPeriod(arg?: Date[]) {
        const period = ((arg: Date[] | undefined | undefined[]) => {
            if (arg === undefined || arg[0] === undefined)
                return Period.getPeriod([dayjs("1970-01-01").toDate(), dayjs().toDate()])
            return Period.getPeriod(arg)
        })(arg)
        return [{
            firstEpisodeAired: { gte: period[0] },
            lastEpisodeAired: { lte: period[1], }
        }]

    }

    public static async filterSelector(filterIn: IAnimeFilterService) {
        const filters = {
            AND: [
                this.byInGenre(filterIn.includeGenres),
                this.byExGenre(filterIn.excludeGenres),
                this.byMediaType(filterIn.mediaTypes),
                this.byRpaRating(filterIn.rpaRatings),
                this.byStatus(filterIn.statuses),
                this.byPeriod(filterIn.period),
            ].flat().filter(filter => filter),
            OR: [
                { lastEpisodeAired: { gte: dayjs("1970-01-01 00:00:00.000").toDate() } },
                this.byName(filterIn.name),
                this.byEnglishName(filterIn.name),
                this.byFranchiseName(filterIn.name),
            ].flat().filter(filter => filter)
        }

        const { filter } = {
            filter: () => ({
                AND: filters.AND.flatMap(filter => {
                    if (filter === undefined) return []
                    return filter
                }),
                OR: filters.OR.flatMap(filter => {
                    if (filter === undefined) return []
                    return filter
                })
            })
        } satisfies Record<string, (...args: any) => Prisma.AnimeWhereInput>;

        return prisma.anime.findMany({
            where: filter(),
            select: {
                firstEpisodeAired: true,
                lastEpisodeAired: true,
                id: true,
                englishName: true,
                name: true,
                slug: true,
                genres: true,
                shikimoriScore: true,
                rpaRating: true,
                image: true,
                mediaType: true
            }
        })
    }
}
