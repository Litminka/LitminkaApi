import { ValidationChain } from 'express-validator';
import Request from '@requests/Request';
import { querySoftPeriodValidator } from '@/validators/QueryBaseValidator';

export default class GetNotificationsCountRequest extends Request {
    public query!: {
        period: Date[];
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [...querySoftPeriodValidator('period')];
    }
}

export const GetNotificationsCountReq = new GetNotificationsCountRequest().send();
