import { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { logger } from "../loggerConf";

interface IFilterSelector {
    years?: Date[],
    period?: Date[],
    seasons?: string[],
    genres?: number[],
    name?: string,
    episode?: number,
    statuses?: string[],
    pgRatings?: string[],
    mediaTypes?: string[]
}

export class AnimeFilterSelector {
    public async filter(filters: IFilterSelector) {
        const whereAnd = filters.genres?.map(genre => { return { genres: { some: { id: genre } } } })
        const { byGenre } = {
            byGenre: () => ({
                AND: whereAnd
            })
        } satisfies Record<string, (...args: any) => Prisma.AnimeWhereInput>;
        return prisma.anime.findMany({
            where: byGenre(),
            select: { id: true, englishName: true, name: true, slug: true }
        })
    }
}
