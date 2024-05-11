import Request from '@/http/requests/Request';
import { ValidationChain } from 'express-validator';
import { queryStringValidator } from '@/validators/QueryBaseValidator';

export default class LinkShikimoriRequest extends Request {
    public query!: {
        token: string;
        code: string;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [queryStringValidator('token'), queryStringValidator('code')];
    }
}

export const linkShikimoriReq = new LinkShikimoriRequest().send();
