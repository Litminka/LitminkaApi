import AuthRequest from "@requests/AuthRequest";
import { minmax } from "@/ts";
import prisma from "@/db";
import { paramIntValidator } from "@/validators/ParamBaseValidator";
import { baseMsg, searchMsg } from "@/ts/messages";
import { bodyBoolValidator, bodyIntValidator, bodyStringValidator } from "@/validators/BodyBaseValidator";
import { WatchListStatuses } from "@/ts/enums";

export default class EditWatchListRequest extends AuthRequest {

    /**
     * append ValidationChain to class context
     */
    protected rulesExtend(): void {
        super.rulesExtend()
        const watchedRange: minmax = { min: 0 };
        this.rulesArr.push([
            paramIntValidator({
                fieldName: "animeId",
                message: baseMsg.valueNotInRange
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
                message: searchMsg.maxLengthExceeded
            }).isIn(Object.values(WatchListStatuses)),

            bodyIntValidator({
                fieldName: "watchedEpisodes",
                typeParams: watchedRange,
                message: baseMsg.valueNotInRange
            }),

            bodyIntValidator({
                fieldName: "rating",
                typeParams: { min: 0, max: 10 },
                message: baseMsg.valueNotInRange
            }),

            bodyBoolValidator({
                fieldName: "isFavorite",
                message: baseMsg.valueMustBeBool
            })
        ])
    }
}