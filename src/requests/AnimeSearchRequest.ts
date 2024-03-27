import { RequestAuthTypes } from "@/ts/enums";
import Request from "@requests/Request";
import { bodySoftPeriodValidator } from "@validators/PeriodValidator";
import { bodyArrayValidator, bodyIdValidator, bodyStringValidator, queryIntValidator } from "@validators/BaseValidator";
import { validation } from "@/ts/messages"
import { AnimeStatuses, AnimeSeasons, AnimePgaRatings, AnimeMediaTypes } from "@/ts/enums";

export default class SearchAnimeRequest extends Request {

    /**
     * Define auth type for this request
     */
    protected authType = RequestAuthTypes.None;

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        const msg = validation.errors.base
        return [
            bodyStringValidator({
                fieldName: "name",
                message: ""
            }).optional(),

            bodyArrayValidator({
                fieldName: "seasons",
                typeParams: { max: 4 },
                message: ""
            }).optional(), bodyStringValidator({
                fieldName: "seasons.*",
                message: ""
            }).isIn(Object.values(AnimeSeasons)),

            bodyArrayValidator({
                fieldName: "statuses",
                typeParams: { max: 3 },
                message: ""
            }).optional(), bodyStringValidator({
                fieldName: "statuses.*",
                message: ""
            }).isIn(Object.values(AnimeStatuses)),

            bodyArrayValidator({
                fieldName: "rpaRatings",
                typeParams: { max: 6 },
                message: ""
            }).optional(), bodyStringValidator({
                fieldName: "rpaRatings.*",
                message: ""
            }).isIn(Object.values(AnimePgaRatings)),

            bodyArrayValidator({
                fieldName: "mediaTypes",
                typeParams: { max: 6 },
                message: ""
            }).optional(), bodyStringValidator({
                fieldName: "mediaTypes.*",
                message: ""
            }).isIn(Object.values(AnimeMediaTypes)),

            bodyArrayValidator({
                fieldName: "includeGenres",
                message: ""
            }).optional(), bodyIdValidator({
                fieldName: "includeGenres.*",
                message: ""
            }),

            bodyArrayValidator({
                fieldName: "excludeGenres",
                message: ""
            }).optional(), bodyIdValidator({
                fieldName: "excludeGenres.*",
                message: ""
            }),

            bodySoftPeriodValidator({
                fieldName: "period",
                message: msg.valueNotInRange
            }),

            queryIntValidator({
                fieldName: "page",
                defValue: 1,
                typeParams: { min: 1 },
                message: { msg: msg.valueNotInRange, range: [1, null] }
            }),

            queryIntValidator({
                fieldName: "pageLimit",
                defValue: 25,
                typeParams: { min: 1, max: 125 },
                message: { msg: msg.valueNotInRange, range: [1, 125] }
            }),
        ]
    }
}