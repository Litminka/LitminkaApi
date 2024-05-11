import { bodyBoolValidator } from '@/validators/BodyBaseValidator';
import { ValidationChain } from 'express-validator';
import OptionalRequest from '@requests/OptionalRequest';

export default class GetTopAnimeRequest extends OptionalRequest {
    public body!: {
        shikimori: boolean;
        withCensored: boolean;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            bodyBoolValidator('shikimori', { defValue: false }),
            bodyBoolValidator('withCensored', { defValue: false })
        ];
    }
}

export const getTopAnimeReq = new GetTopAnimeRequest().send();
