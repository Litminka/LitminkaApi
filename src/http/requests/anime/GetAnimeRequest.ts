import { baseMsg, searchMsg } from '@/ts/messages';
import { AnimeStatuses, AnimePgaRatings, AnimeMediaTypes } from '@enums';
import { query, ValidationChain } from 'express-validator';
import { isSeason } from '@/helper/animeseason';
import OptionalRequest from '@requests/OptionalRequest';
import Request from '@requests/Request';
import {
    queryArrayValidator,
    queryBoolValidator,
    queryIntValidator,
    querySoftPeriodValidator,
    queryStringValidator
} from '@/validators/QueryBaseValidator';
import { SortDirectionType, SortAnimeSearchType } from '@/ts/sorts';

export default class GetAnimeRequest extends OptionalRequest {
    public static sortFields = ['Name', 'Rating', 'ShikimoriRating', 'ReleaseDate'] as const;
    public query!: {
        name?: string;
        seasons?: string[];
        statuses?: AnimeStatuses[];
        rpaRatings?: AnimePgaRatings[];
        mediaTypes?: AnimeMediaTypes[];
        includeGenres?: number[];
        excludeGenres?: number[];
        period?: Date[];
        sortField?: SortAnimeSearchType;
        sortDirection?: SortDirectionType;
        withCensored?: boolean;
        isWatchable: boolean;
        banInRussia: boolean;
        page: number;
        pageLimit: number;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            queryStringValidator('name').optional(),

            queryArrayValidator('seasons', {
                typeParams: { max: 2 }
            }).optional(),
            queryStringValidator('seasons.*').custom((value) => {
                if (!isSeason(value)) throw new Error(baseMsg.valueNotInRange);
                return true;
            }),

            queryArrayValidator('statuses', {
                typeParams: { max: 3 }
            }).optional(),
            queryStringValidator('statuses.*')
                .isIn(Object.values(AnimeStatuses))
                .withMessage(searchMsg.unknownType),

            queryArrayValidator('rpaRatings', {
                typeParams: { max: 6 }
            }).optional(),
            queryStringValidator('rpaRatings.*')
                .isIn(Object.values(AnimePgaRatings))
                .withMessage(searchMsg.unknownType),

            queryArrayValidator('mediaTypes', {
                typeParams: { max: 6 }
            }).optional(),
            queryStringValidator('mediaTypes.*')
                .isIn(Object.values(AnimeMediaTypes))
                .withMessage(searchMsg.unknownType),

            queryArrayValidator('includeGenres').optional(),
            queryIntValidator('includeGenres.*'),

            queryArrayValidator('excludeGenres').optional(),
            queryIntValidator('excludeGenres.*'),

            ...querySoftPeriodValidator('period'),

            queryBoolValidator('isWatchable').optional(),

            queryBoolValidator('withCensored', { defValue: false }),

            query('sortField')
                .isIn(GetAnimeRequest.sortFields)
                .withMessage(searchMsg.unknownType)
                .optional(),

            query('sortDirection')
                .isIn(Request.sortDirections)
                .withMessage(searchMsg.unknownType)
                .optional(),

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
