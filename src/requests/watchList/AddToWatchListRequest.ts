import AuthRequest from "@requests/AuthRequest";
import prisma from "@/db";
import { minmax } from "@/ts";
import { paramIntValidator } from "@/validators/ParamBaseValidator";
import { baseMsg, searchMsg } from "@/ts/messages";
import { bodyBoolValidator, bodyIntValidator, bodyStringValidator } from "@/validators/BodyBaseValidator";
import { WatchListStatuses } from "@/ts/enums";

export default class AddToWatchListRequest extends AuthRequest {

    /**
     * append ValidationChain to class context
     */
    protected rulesExtend(): void {
        super.rulesExtend()
        const watchedRange: minmax = { min: 0 };
        this.rulesArr.push([
            paramIntValidator({
                fieldName: "animeId",
                ifNotTypeParamsMessage: baseMsg.valueNotInRange
            }).custom(async value => {
                // TODO: this will die, if it doesnt find an anime
                const anime = await prisma.anime.findFirst({
                    where: { id: value }
                });
                if (!anime) throw new Error("Anime doesn't exist");
                watchedRange.max = anime.maxEpisodes;
            }),

            bodyStringValidator({
                fieldName: "status",
                ifNotTypeParamsMessage: searchMsg.maxLengthExceeded
            }).isIn(Object.values(WatchListStatuses)),

            bodyIntValidator({
                fieldName: "watchedEpisodes",
                typeParams: watchedRange,
                ifNotTypeParamsMessage: baseMsg.valueNotInRange
            }),

            bodyIntValidator({
                fieldName: "rating",
                typeParams: { min: 0, max: 10 },
                ifNotTypeParamsMessage: baseMsg.valueNotInRange
            }),

            bodyBoolValidator({
                fieldName: "isFavorite",
                ifNotTypeParamsMessage: baseMsg.requiresBoolean
            })
        ])
    }
}