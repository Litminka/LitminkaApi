import { param, ValidationChain } from "express-validator";
import prisma from "@/db";
import { GroupReq, GroupRequest } from "@requests/group/GroupRequest";
import { paramIntValidator } from "@/validators/ParamBaseValidator";

export interface DeleteGroupAnimeListReq extends GroupReq {
    params: {
        animeId: number,
        groupId: number
    },
}

export default class DeleteGroupAnimeListRequest extends GroupRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            paramIntValidator("groupId"),
            paramIntValidator("animeId").custom(async value => {
                const anime = await prisma.anime.findFirst({
                    where: { id: value }
                });
                if (!anime) throw new Error("Anime doesn't exist");
            })
        ]
    }
}