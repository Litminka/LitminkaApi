import Request from "@requests/Request";
import { bodySoftPeriodValidator } from "@validators/BodyPeriodValidator";
import { bodyArrayValidator, bodyBoolValidator, bodyIntValidator, bodyStringValidator } from "@validators/BodyBaseValidator";
import { queryIntValidator } from "@validators/QueryBaseValidator";
import { searchMsg } from "@/ts/messages"
import { AnimeStatuses, AnimePgaRatings, AnimeMediaTypes } from "@/ts/enums";
import { ValidationChain } from "express-validator";
import { Request as ExpressRequest } from "express";
import { OptionalReq, OptionalRequest } from "@requests/OptionalRequest";
import { isSeason } from "@/helper/animeseason";

type queryType = ExpressRequest<{}, {}, {}, {}> // workaround on query
export interface GetAnimeReq extends queryType, OptionalReq {
    body: {
        name?: string,
        seasons?: string[],
        statuses?: AnimeStatuses[],
        rpaRatings?: AnimePgaRatings[],
        mediaTypes?: AnimeMediaTypes[],
        includeGenres?: number[],
        excludeGenres?: number[],
        period?: Date[],
        withCensored: boolean,
    },
    query: {
        page?: number,
        pageLimit?: number,
    }
}

export class GetAnimeRequest extends OptionalRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            bodyStringValidator("name").optional(),
            bodyArrayValidator("seasons", {
                typeParams: { max: 2 },
            }).optional(),
            bodyStringValidator("seasons.*").custom((value) => {
                return isSeason(value);
            }).withMessage(searchMsg.unknownType),
            bodyArrayValidator("statuses", {
                typeParams: { max: 3 },
            }).optional(),
            bodyStringValidator("statuses.*").isIn(Object.values(AnimeStatuses)).withMessage(searchMsg.unknownType),
            bodyArrayValidator("rpaRatings", {
                typeParams: { max: 6 },
            }).optional(),
            bodyStringValidator("rpaRatings.*").isIn(Object.values(AnimePgaRatings)).withMessage(searchMsg.unknownType),

            bodyArrayValidator("mediaTypes", {
                typeParams: { max: 6 },
            }).optional(),
            bodyStringValidator("mediaTypes.*").isIn(Object.values(AnimeMediaTypes)).withMessage(searchMsg.unknownType),
            bodyArrayValidator("includeGenres").optional(),
            bodyIntValidator("includeGenres.*"),

            bodyArrayValidator("excludeGenres").optional(),
            bodyIntValidator("excludeGenres.*"),

            ...bodySoftPeriodValidator("period"),

            bodyBoolValidator('withCensored', { defValue: false }),

            queryIntValidator("page", {
                defValue: 1,
                typeParams: { min: 1 },
            }),

            queryIntValidator("pageLimit", {
                defValue: 25,
                typeParams: { min: 1, max: 125 },
            }),
        ]
    }
}