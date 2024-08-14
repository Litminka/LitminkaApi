import { ValidationChain } from 'express-validator';
import GroupRequest from '@requests/group/GroupRequest';
import { WatchListStatuses } from '@enums';
import {
    queryArrayValidator,
    queryStringValidator,
    queryBoolValidator,
    queryIntValidator
} from '@/validators/QueryBaseValidator';
import { paramIntValidator } from '@/validators/ParamBaseValidator';

export default class GetGroupAnimeListRequest extends GroupRequest {
    public params!: {
        groupId: number;
    };
    public query!: {
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
            paramIntValidator('groupId'),

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

export const getGroupAnimeListReq = new GetGroupAnimeListRequest().send();
