import prisma from '@/db';
import { body, param } from "express-validator";

export const DeleteFromWatchListValidator = (): any[] => {
    return [
        param("animeId").notEmpty().isInt().bail().toInt().custom(async value => {
            const anime = await prisma.anime.findFirst({
                where: { id: value }
            });
            if (!anime) throw new Error("Anime doesn't exist");
        })
    ]
}

export const GetFilteredWatchListValidator = (): any[] => {
    return [
        body("statuses").optional().toArray(),
        body("statuses.*").notEmpty().bail().isIn(["planned", "watching", "rewatching", "completed", "on_hold", "dropped"]),
        body("ratings").optional().toArray(),
        body("ratings.*").notEmpty().bail().isInt({ min: 0, max: 10 }),
        body("isFavorite").optional().notEmpty().bail().isBoolean().bail().toBoolean()
    ]
}
// TODO: Add custom messages to this validator