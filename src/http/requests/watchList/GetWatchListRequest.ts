import { ValidationChain } from 'express-validator';
import { AuthReq, AuthRequest } from '@requests/AuthRequest';
import {
    bodyArrayValidator,
    bodyBoolValidator,
    bodyIntValidator,
    bodyStringValidator
} from '@/validators/BodyBaseValidator';
import { WatchListStatuses } from '@/ts/enums';
import { queryIntValidator } from '@/validators/QueryBaseValidator';

export interface GetWatchListReq extends AuthReq {
    body: {
        statuses?: WatchListStatuses[];
        ratings?: number[];
        isFavorite?: boolean;
    };
    query: {
        page: number;
        pageLimit: number;
    };
}

export class GetWatchListRequest extends AuthRequest {
    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            bodyArrayValidator('statuses').optional(),
            bodyStringValidator('statuses.*').isIn(Object.values(WatchListStatuses)),

            bodyArrayValidator('ratings').optional(),
            bodyIntValidator('ratings.*', {
                typeParams: { min: 0, max: 10 }
            }),

            bodyBoolValidator('isFavorite').optional(),

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
