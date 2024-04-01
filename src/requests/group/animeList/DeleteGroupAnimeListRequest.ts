import { param, ValidationChain } from "express-validator";
import prisma from "@/db";
import GroupRequest from "@requests/group/GroupRequest";

export default class DeleteGroupAnimeListRequest extends GroupRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            param("groupId").isInt().bail().toInt(),
            param("animeId").notEmpty().isInt().bail().toInt().custom(async value => {
                const anime = await prisma.anime.findFirst({
                    where: { id: value }
                });
                if (!anime) throw new Error("Anime doesn't exist");
            })
        ]
    }
}