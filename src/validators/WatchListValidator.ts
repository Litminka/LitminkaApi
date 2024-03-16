import prisma from '@litminka/db';
import { body, param } from "express-validator";
interface minmax {
    min: number,
    max?: number
}
export const AddToWatchListValidation = (): any[] => {
    const watchedRange: minmax = { min: 0 };
    return [
        param("animeId").notEmpty().isInt().bail().toInt().custom(async value => {
            // TODO: this will die, if it doesnt find an anime
            const anime = await prisma.anime.findFirst({
                where: { id: value }
            });
            if (!anime) throw new Error("Anime doesn't exist");
            watchedRange.max = anime.maxEpisodes;
        }),
        body("status").notEmpty().bail().isString().bail().isIn(["planned", "watching", "rewatching", "completed", "on_hold", "dropped"]),
        body("watchedEpisodes").notEmpty().bail().isInt(watchedRange).withMessage("Amount should be min 0 and should not be larger than the amount of episodes"),
        body("rating").notEmpty().bail().isInt({ min: 0, max: 10 }),
        body("isFavorite").notEmpty().bail().isBoolean().bail().toBoolean()
    ]
};
export const EditWatchListValidation = (): any[] => {

    const watchedRange: minmax = { min: 0 };
    return [
        param("animeId").notEmpty().isInt().bail().toInt().custom(async value => {
            const anime = await prisma.anime.findFirst({
                where: { id: value }
            });
            if (!anime) throw new Error("Anime doesn't exist");
            watchedRange.max = anime.maxEpisodes;
        }).bail(),
        body("status").notEmpty().bail().isString().bail().isIn(["planned", "watching", "rewatching", "completed", "on_hold", "dropped"]),
        body("watchedEpisodes").notEmpty().bail().isInt(watchedRange).withMessage("Amount should be min 0 and should not be larger than the amount of episodes"),
        body("rating").notEmpty().bail().isInt({ min: 0, max: 10 }),
        body("isFavorite").notEmpty().bail().isBoolean().bail().toBoolean()
    ]
};

export const DeleteFromWatchListValidation = (): any[] => {
    return [
        param("animeId").notEmpty().isInt().bail().toInt().custom(async value => {
            const anime = await prisma.anime.findFirst({
                where: { id: value }
            });
            if (!anime) throw new Error("Anime doesn't exist");
        })
    ]
}
// TODO: Add custom messages to this validator