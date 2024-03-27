import { RequestAuthTypes } from "@/ts/enums";
import Request from "@requests/Request";
import { bodySoftPeriodValidator } from "@validators/PeriodValidator";
import { bodyArrayValidator, bodyIdValidator, bodyStringValidator, queryIntValidator } from "@validators/BaseValidator";
import { validation } from "@/ts/messages"
import { AnimeStatuses, AnimeSeasons, AnimePgaRatings, AnimeMediaTypes } from "@/ts/enums";

const search = validation.errors.search;
const base = validation.errors.base;

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
        return [
            bodyStringValidator({
                fieldName: "name",
                message: search.maxLengthExceeded
            }).optional(),

            bodyArrayValidator({
                fieldName: "seasons",
                typeParams: { max: 4 },
                message: search.maxArraySizeExceeded
            }).optional(), 
            bodyStringValidator({
                fieldName: "seasons.*",
                message: search.maxLengthExceeded
            }).isIn(Object.values(AnimeSeasons))
            .withMessage(search.unknownType),

            bodyArrayValidator({
                fieldName: "statuses",
                typeParams: { max: 3 },
                message: search.maxArraySizeExceeded
            }).optional(), 
            bodyStringValidator({
                fieldName: "statuses.*",
                message: search.maxLengthExceeded
            }).isIn(Object.values(AnimeStatuses))
            .withMessage(search.unknownType),

            bodyArrayValidator({
                fieldName: "rpaRatings",
                typeParams: { max: 6 },
                message: search.maxArraySizeExceeded
            }).optional(), 
            bodyStringValidator({
                fieldName: "rpaRatings.*",
                message: search.maxLengthExceeded
            }).isIn(Object.values(AnimePgaRatings))
            .withMessage(search.unknownType),

            bodyArrayValidator({
                fieldName: "mediaTypes",
                typeParams: { max: 6 },
                message: search.maxArraySizeExceeded
            }).optional(), 
            bodyStringValidator({
                fieldName: "mediaTypes.*",
                message: search.maxLengthExceeded
            }).isIn(Object.values(AnimeMediaTypes))
            .withMessage(search.unknownType),

            bodyArrayValidator({
                fieldName: "includeGenres",
                message: search.maxArraySizeExceeded
            }).optional(), 
            bodyIdValidator({
                fieldName: "includeGenres.*",
                message: base.valueNotInRange
            }),

            bodyArrayValidator({
                fieldName: "excludeGenres",
                message: search.maxArraySizeExceeded
            }).optional(), 
            bodyIdValidator({
                fieldName: "excludeGenres.*",
                message: base.valueNotInRange
            }),

            bodySoftPeriodValidator({
                fieldName: "period",
                message: base.valueNotInRange
            }),

            queryIntValidator({
                fieldName: "page",
                defValue: 1,
                typeParams: { min: 1 },
                message: { msg: base.valueNotInRange, range: [1, null] }
            }),

            queryIntValidator({
                fieldName: "pageLimit",
                defValue: 25,
                typeParams: { min: 1, max: 125 },
                message: { msg: base.valueNotInRange, range: [1, 125] }
            }),
        ]
    }
}