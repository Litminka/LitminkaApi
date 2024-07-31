import { ValidationChain } from 'express-validator';
import Request from '@/http/requests/Request';
import { queryIntValidator, querySoftPeriodValidator } from '@/validators/QueryBaseValidator';

export default class GetNotificationsRequest extends Request {
    public query!: {
        period: Date[];
        page: number;
        pageLimit: number;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            ...querySoftPeriodValidator('period'),
            queryIntValidator('page', {
                defValue: 1,
                typeParams: { min: 1 }
            }),
            queryIntValidator('pageLimit', {
                defValue: 50,
                typeParams: { min: 1, max: 125 }
            })
        ];
    }
}

export const getNotificationsReq = new GetNotificationsRequest().send();
