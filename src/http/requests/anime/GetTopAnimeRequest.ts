import Request from '@/http/requests/Request';
import { bodyBoolValidator } from '@/validators/BodyBaseValidator';
import { ValidationChain } from 'express-validator';

export default class GetTopAnimeRequest extends Request {
    public body!: {
        shikimori: boolean;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [bodyBoolValidator('shikimori', { defValue: false })];
    }
}

export const getTopAnimeReq = new GetTopAnimeRequest().send();
