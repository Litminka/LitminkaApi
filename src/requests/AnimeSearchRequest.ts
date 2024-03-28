import { RequestAuthTypes } from "@/ts/enums";
import Request from "@requests/Request";
import { bodySoftPeriodValidator } from "@/validators/BodyPeriodValidator";
import { bodyArrayValidator, bodyIdValidator, bodyStringValidator } from "@validators/BodyBaseValidator";
import { queryIntValidator } from "@/validators/QueryBaseValidator";
import { baseMsg, searchMsg } from "@/ts/messages"
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
        return [
            bodyStringValidator({
                fieldName: "name",
                message: searchMsg.maxLengthExceeded
            }).optional(),

            bodyArrayValidator({
                fieldName: "seasons",
                typeParams: { max: 4 },
                message: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyStringValidator({
                fieldName: "seasons.*",
                message: searchMsg.maxLengthExceeded
            }).isIn(Object.values(AnimeSeasons))
                .withMessage(searchMsg.unknownType),

            bodyArrayValidator({
                fieldName: "statuses",
                typeParams: { max: 3 },
                message: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyStringValidator({
                fieldName: "statuses.*",
                message: searchMsg.maxLengthExceeded
            }).isIn(Object.values(AnimeStatuses))
                .withMessage(searchMsg.unknownType),

            bodyArrayValidator({
                fieldName: "rpaRatings",
                typeParams: { max: 6 },
                message: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyStringValidator({
                fieldName: "rpaRatings.*",
                message: searchMsg.maxLengthExceeded
            }).isIn(Object.values(AnimePgaRatings))
                .withMessage(searchMsg.unknownType),

            bodyArrayValidator({
                fieldName: "mediaTypes",
                typeParams: { max: 6 },
                message: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyStringValidator({
                fieldName: "mediaTypes.*",
                message: searchMsg.maxLengthExceeded
            }).isIn(Object.values(AnimeMediaTypes))
                .withMessage(searchMsg.unknownType),

            bodyArrayValidator({
                fieldName: "includeGenres",
                message: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyIdValidator({
                fieldName: "includeGenres.*",
                message: baseMsg.valueNotInRange
            }),

            bodyArrayValidator({
                fieldName: "excludeGenres",
                message: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyIdValidator({
                fieldName: "excludeGenres.*",
                message: baseMsg.valueNotInRange
            }),

            bodySoftPeriodValidator({
                fieldName: "period",
                message: baseMsg.valueNotInRange
            }),

            queryIntValidator({
                fieldName: "page",
                defValue: 1,
                typeParams: { min: 1 },
                message: { msg: baseMsg.valueNotInRange, range: [1, null] }
            }),

            queryIntValidator({
                fieldName: "pageLimit",
                defValue: 25,
                typeParams: { min: 1, max: 125 },
                message: { msg: baseMsg.valueNotInRange, range: [1, 125] }
            }),
        ]
    }
}