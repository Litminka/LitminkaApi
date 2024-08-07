import { baseMsg, searchMsg } from '@/ts/messages';
import { AnimeStatuses, AnimePgaRatings, AnimeMediaTypes } from '@enums';
import { ValidationChain } from 'express-validator';
import { isSeason } from '@/helper/animeseason';
import OptionalRequest from '../OptionalRequest';
import {
    queryArrayValidator,
    queryBoolValidator,
    queryIntValidator,
    querySoftPeriodValidator,
    queryStringValidator
} from '@/validators/QueryBaseValidator';

type AnimeSearchSorts = (typeof sorts)[number];
type AnimeSearchSortDirection = (typeof sortDirection)[number];

const sorts = ['name', 'rating', 'shikimoriRating', 'firstEpisodeAired'] as const;
const sortDirection = ['asc', 'desc'] as const;

export default class GetAnimeRequest extends OptionalRequest {
    public query!: {
        name?: string;
        seasons?: string[];
        statuses?: AnimeStatuses[];
        rpaRatings?: AnimePgaRatings[];
        mediaTypes?: AnimeMediaTypes[];
        includeGenres?: number[];
        excludeGenres?: number[];
        period?: Date[];
        sort?: AnimeSearchSorts;
        sortDirection?: AnimeSearchSortDirection;
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

            queryStringValidator('sort').optional().isIn(sorts),
            queryStringValidator('sortDirection').optional().isIn(sortDirection),

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
