import AuthRequest from "@requests/AuthRequest";
import { body, param } from "express-validator";
import prisma from "@/db";
import { minmax } from "@/ts";



export default class AddToWatchListRequest extends AuthRequest {

    /**
    * define validation rules for this request
    * @returns ValidationChain
    */
    protected rules(): any[] {
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
    }
}