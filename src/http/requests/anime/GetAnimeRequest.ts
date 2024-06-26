import { bodySoftPeriodValidator } from '@/validators/BodyPeriodValidator';
import {
    bodyArrayValidator,
    bodyBoolValidator,
    bodyIntValidator,
    bodyStringValidator
} from '@/validators/BodyBaseValidator';
import { queryIntValidator } from '@/validators/QueryBaseValidator';
import { baseMsg, searchMsg } from '@/ts/messages';
import { AnimeStatuses, AnimePgaRatings, AnimeMediaTypes } from '@enums';
import { ValidationChain } from 'express-validator';
import { isSeason } from '@/helper/animeseason';
import OptionalRequest from '../OptionalRequest';

export default class GetAnimeRequest extends OptionalRequest {
    public body!: {
        name?: string;
        seasons?: string[];
        statuses?: AnimeStatuses[];
        rpaRatings?: AnimePgaRatings[];
        mediaTypes?: AnimeMediaTypes[];
        includeGenres?: number[];
        excludeGenres?: number[];
        period?: Date[];
        withCensored: boolean;
        isWatchable: boolean;
        banInRussia: boolean;
    };
    public query!: {
        page: number;
        pageLimit: number;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            bodyStringValidator('name').optional(),

            bodyArrayValidator('seasons', {
                typeParams: { max: 2 }
            }).optional(),
            bodyStringValidator('seasons.*').custom((value) => {
                if (!isSeason(value)) throw new Error(baseMsg.valueNotInRange);
                return true;
            }),

            bodyArrayValidator('statuses', {
                typeParams: { max: 3 }
            }).optional(),
            bodyStringValidator('statuses.*')
                .isIn(Object.values(AnimeStatuses))
                .withMessage(searchMsg.unknownType),

            bodyArrayValidator('rpaRatings', {
                typeParams: { max: 6 }
            }).optional(),
            bodyStringValidator('rpaRatings.*')
                .isIn(Object.values(AnimePgaRatings))
                .withMessage(searchMsg.unknownType),

            bodyArrayValidator('mediaTypes', {
                typeParams: { max: 6 }
            }).optional(),
            bodyStringValidator('mediaTypes.*')
                .isIn(Object.values(AnimeMediaTypes))
                .withMessage(searchMsg.unknownType),

            bodyArrayValidator('includeGenres').optional(),
            bodyIntValidator('includeGenres.*'),

            bodyArrayValidator('excludeGenres').optional(),
            bodyIntValidator('excludeGenres.*'),

            ...bodySoftPeriodValidator('period'),

            bodyBoolValidator('withCensored', { defValue: false }),

            bodyBoolValidator('isWatchable', { defValue: false }),

            queryIntValidator('page', {
                defValue: 1,
                typeParams: { min: 1 }
            }),

            queryIntValidator('pageLimit', {
                defValue: 25,
                typeParams: { min: 1, max: 125 }
            })
        ];
    }
}

export const getAnimeReq = new GetAnimeRequest().send();
