import { bodySoftPeriodValidator } from '@/validators/BodyPeriodValidator';
import { ValidationChain } from 'express-validator';
import Request from '@/http/requests/Request';

export default class GetNotificationsRequest extends Request {
    public body!: {
        period: Date[];
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [...bodySoftPeriodValidator('period')];
    }
}

export const getNotificationsReq = new GetNotificationsRequest().send();
