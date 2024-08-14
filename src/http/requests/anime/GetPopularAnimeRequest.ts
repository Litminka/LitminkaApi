import { ValidationChain } from 'express-validator';
import OptionalRequest from '@requests/OptionalRequest';
import { queryBoolValidator } from '@/validators/QueryBaseValidator';

export default class GetPopularAnimeRequest extends OptionalRequest {
    public query!: {
        shikimori: boolean;
        withCensored: boolean;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            queryBoolValidator('shikimori', { defValue: false }),
            queryBoolValidator('withCensored', { defValue: false })
        ];
    }
}

export const getPopularAnimeReq = new GetPopularAnimeRequest().send();
