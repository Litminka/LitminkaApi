import { RequestAuthTypes } from "@/ts/enums";
import Request from "@requests/Request";
import { bodySoftPeriodValidator } from "@/validators/BodyPeriodValidator";
import { bodyArrayValidator, bodyIntValidator, bodyStringValidator } from "@validators/BodyBaseValidator";
import { queryIntValidator } from "@/validators/QueryBaseValidator";
import { baseMsg, searchMsg } from "@/ts/messages"
import { AnimeStatuses, AnimeSeasons, AnimePgaRatings, AnimeMediaTypes } from "@/ts/enums";


export default class SearchAnimeRequest extends Request {

    /**
     * Define auth type for this request
     */
    protected authType = RequestAuthTypes.None;

    /**
     * append ValidationChain to class context
     */
    protected rulesExtend(): void {
        super.rulesExtend()
        this.rulesArr.push([
            bodyStringValidator({
                fieldName: "name",
                ifNotTypeParamsMessage: searchMsg.maxLengthExceeded
            }).optional(),

            bodyArrayValidator({
                fieldName: "seasons",
                typeParams: { max: 4 },
                ifNotTypeParamsMessage: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyStringValidator({
                fieldName: "seasons.*",
                ifNotTypeParamsMessage: searchMsg.maxLengthExceeded
            }).isIn(Object.values(AnimeSeasons))
                .withMessage(searchMsg.unknownType),

            bodyArrayValidator({
                fieldName: "statuses",
                typeParams: { max: 3 },
                ifNotTypeParamsMessage: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyStringValidator({
                fieldName: "statuses.*",
                ifNotTypeParamsMessage: searchMsg.maxLengthExceeded
            }).isIn(Object.values(AnimeStatuses))
                .withMessage(searchMsg.unknownType),

            bodyArrayValidator({
                fieldName: "rpaRatings",
                typeParams: { max: 6 },
                ifNotTypeParamsMessage: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyStringValidator({
                fieldName: "rpaRatings.*",
                ifNotTypeParamsMessage: searchMsg.maxLengthExceeded
            }).isIn(Object.values(AnimePgaRatings))
                .withMessage(searchMsg.unknownType),

            bodyArrayValidator({
                fieldName: "mediaTypes",
                typeParams: { max: 6 },
                ifNotTypeParamsMessage: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyStringValidator({
                fieldName: "mediaTypes.*",
                ifNotTypeParamsMessage: searchMsg.maxLengthExceeded
            }).isIn(Object.values(AnimeMediaTypes))
                .withMessage(searchMsg.unknownType),

            bodyArrayValidator({
                fieldName: "includeGenres",
                ifNotTypeParamsMessage: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyIntValidator({
                fieldName: "includeGenres.*",
                ifNotTypeParamsMessage: baseMsg.valueNotInRange
            }),

            bodyArrayValidator({
                fieldName: "excludeGenres",
                ifNotTypeParamsMessage: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyIntValidator({
                fieldName: "excludeGenres.*",
                ifNotTypeParamsMessage: baseMsg.valueNotInRange
            }),

            bodySoftPeriodValidator({
                fieldName: "period",
                ifNotTypeParamsMessage: baseMsg.valueNotInRange
            }),

            queryIntValidator({
                fieldName: "page",
                defValue: 1,
                typeParams: { min: 1 },
                ifNotTypeParamsMessage: { msg: baseMsg.valueNotInRange, range: [1, null] }
            }),

            queryIntValidator({
                fieldName: "pageLimit",
                defValue: 25,
                typeParams: { min: 1, max: 125 },
                ifNotTypeParamsMessage: { msg: baseMsg.valueNotInRange, range: [1, 125] }
            }),
        ])
    }
}