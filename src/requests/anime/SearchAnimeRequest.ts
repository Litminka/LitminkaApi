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
    protected rules(): ValidationChain[] {

        return [
            bodyStringValidator("name", {
                message: searchMsg.maxLengthExceeded
            }).optional(),

            bodyArrayValidator("seasons", {
                typeParams: { max: 4 },
                message: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyStringValidator("seasons.*", {
                message: searchMsg.maxLengthExceeded
            }).isIn(Object.values(AnimeSeasons))
                .withMessage(searchMsg.unknownType),

            bodyArrayValidator("statuses", {
                typeParams: { max: 3 },
                message: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyStringValidator("statuses.*", {
                message: searchMsg.maxLengthExceeded
            }).isIn(Object.values(AnimeStatuses))
                .withMessage(searchMsg.unknownType),

            bodyArrayValidator("rpaRatings", {
                typeParams: { max: 6 },
                message: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyStringValidator("rpaRatings.*", {
                message: searchMsg.maxLengthExceeded
            }).isIn(Object.values(AnimePgaRatings))
                .withMessage(searchMsg.unknownType),

            bodyArrayValidator("mediaTypes", {
                typeParams: { max: 6 },
                message: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyStringValidator("mediaTypes.*", {
                message: searchMsg.maxLengthExceeded
            }).isIn(Object.values(AnimeMediaTypes))
                .withMessage(searchMsg.unknownType),

            bodyArrayValidator("includeGenres", {
                message: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyIntValidator("includeGenres.*", {
                message: baseMsg.valueNotInRange
            }),

            bodyArrayValidator("excludeGenres", {
                message: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyIntValidator("excludeGenres.*", {
                message: baseMsg.valueNotInRange
            }),

            bodySoftPeriodValidator("period", {
                message: baseMsg.valueNotInRange
            }),

            queryIntValidator("page", {
                defValue: 1,
                typeParams: { min: 1 },
                message: baseMsg.valueNotInRange
            }),

            queryIntValidator("pageLimit", {
                defValue: 25,
                typeParams: { min: 1, max: 125 },
                message: baseMsg.valueNotInRange
            }),
        ]
    }
}