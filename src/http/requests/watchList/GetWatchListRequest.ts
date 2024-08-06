import { ValidationChain } from 'express-validator';
import AuthRequest from '@requests/AuthRequest';
import { WatchListStatuses } from '@enums';
import {
    queryArrayValidator,
    queryBoolValidator,
    queryIntValidator,
    queryStringValidator
} from '@/validators/QueryBaseValidator';

export default class GetWatchListRequest extends AuthRequest {
    query!: {
        statuses?: WatchListStatuses[];
        ratings?: number[];
        isFavorite?: boolean;
        page: number;
        pageLimit: number;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            queryArrayValidator('statuses').optional(),
            queryStringValidator('statuses.*').isIn(Object.values(WatchListStatuses)),

            queryArrayValidator('ratings').optional(),
            queryIntValidator('ratings.*', { typeParams: { min: 0, max: 10 } }),

            queryBoolValidator('isFavorite').optional(),

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

export const getWatchListReq = new GetWatchListRequest().send();
