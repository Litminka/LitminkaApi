import Request from '@requests/Request';
import { bodyBoolValidator } from '@validators/BodyBaseValidator';
import { ValidationChain } from 'express-validator';
import { Request as ExpressRequest } from 'express';

export interface GetTopAnimeReq extends ExpressRequest {
    body: {
        shikimori: boolean;
    };
}

export default class GetTopAnimeRequest extends Request {
    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [bodyBoolValidator('shikimori', { defValue: false })];
    }
}
