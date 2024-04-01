import { minmax } from "@/ts";
import prisma from "@/db";
import { paramIntValidator } from "@validators/ParamBaseValidator";
import { baseMsg, searchMsg } from "@/ts/messages";
import { bodyBoolValidator, bodyIntValidator, bodyStringValidator } from "@validators/BodyBaseValidator";
import { WatchListStatuses } from "@/ts/enums";
import { ValidationChain } from "express-validator";
import IntegrationRequest from "@requests/IntegrationRequest";

export default class EditWatchListRequest extends IntegrationRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {

        const watchedRange: minmax = { min: 0 };
        return [
            paramIntValidator("animeId", {
                message: baseMsg.valueNotInRange
            }).custom(async value => {
                // TODO: this will die, if it doesnt find an anime
                const anime = await prisma.anime.findFirst({
                    where: { id: value }
                });
                if (!anime) throw new Error("Anime doesn't exist");
                watchedRange.max = anime.maxEpisodes;
            }),

            bodyStringValidator("status", {
                message: searchMsg.maxLengthExceeded
            }).isIn(Object.values(WatchListStatuses)),

            bodyIntValidator("watchedEpisodes", {
                typeParams: watchedRange,
                message: baseMsg.valueNotInRange
            }),

            bodyIntValidator("rating", {
                typeParams: { min: 0, max: 10 },
                message: baseMsg.valueNotInRange
            }),

            bodyBoolValidator("isFavorite", {
                message: baseMsg.valueMustBeBool
            })
        ]
    }
}