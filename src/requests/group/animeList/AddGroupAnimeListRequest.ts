import AuthRequest from "@requests/AuthRequest";
import prisma from "@/db";
import { body, param } from "express-validator";
import { minmax } from "@/ts";

export default class AddGroupAnimeListRequest extends AuthRequest {

    /**
     *  if authType is not None 
     *  Define prisma user request for this method
     * 
     *  @returns Prisma User Variant
     */
    protected async auth(userId: number): Promise<any> {
        return await prisma.user.findUserWithOwnedGroups(userId);
    }

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        const watchedRange: minmax = { min: 0 };
        return [
            param("groupId").isInt().bail().toInt(),
            param("animeId").bail().toInt().custom(async value => {
                const anime = await prisma.anime.findFirst({
                    where: { id: value }
                });
                if (!anime) throw new Error("Anime doesn't exist");
                watchedRange.max = anime.maxEpisodes;
            }).bail(),
            body("status").notEmpty().bail().isString().bail().isIn(["planned", "watching", "rewatching", "completed", "on_hold", "dropped"]),
            body("watchedEpisodes").notEmpty().bail().isInt(watchedRange).withMessage("Amount should be min 0 and should not be larger than the amount of episodes"),
            body("rating").notEmpty().bail().isInt({ min: 0, max: 10 }),
            body("isFavorite").notEmpty().bail().isBoolean().bail().toBoolean(),
        ]
    }
}