import { ValidationChain } from 'express-validator';
import OptionalRequest from '@requests/OptionalRequest';
import { queryBoolValidator } from '@/validators/QueryBaseValidator';

export default class FrontPageAnimeRequest extends OptionalRequest {
    public query!: {
        withCensored: boolean;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            queryBoolValidator('withCensored', { defValue: false }),
            queryBoolValidator('isWatchable', { defValue: true })
        ];
    }
}

export const frontPageAnimeReq = new FrontPageAnimeRequest().send();
