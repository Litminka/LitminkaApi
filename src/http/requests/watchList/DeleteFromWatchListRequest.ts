import prisma from "@/db";
import { paramIntValidator } from "@validators/ParamBaseValidator";
import { baseMsg } from "@/ts/messages";
import { ValidationChain } from "express-validator";
import { IntegrationSettingsReq, IntegrationSettingsRequest } from "../IntegrationSettingsRequest";

export interface DeleteFromWatchListReq extends IntegrationSettingsReq {
    params: {
        animeId: number,
    },
}


export class DeleteFromWatchListRequest extends IntegrationSettingsRequest {

    /**
     * Define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): ValidationChain[] {

        return [
            paramIntValidator("animeId", {
                message: baseMsg.valueNotInRange
            }).custom(async value => {
                // TODO: this will die, if it doesnt find an anime
                const anime = await prisma.anime.findFirst({
                    where: { id: value }
                });
                if (!anime) throw new Error("Anime doesn't exist");
            }),
        ]
    }
}