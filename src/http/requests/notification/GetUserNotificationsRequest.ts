import { queryBoolValidator, queryIntValidator } from '@/validators/QueryBaseValidator';
import AuthRequest from '@requests/AuthRequest';
import { ValidationChain } from 'express-validator';

export default class GetUserNotificationsRequest extends AuthRequest {
    public query!: {
        page: number;
        pageLimit: number;
        isRead: boolean;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            queryIntValidator('page', {
                defValue: 1,
                typeParams: { min: 1 }
            }),
            queryIntValidator('pageLimit', {
                defValue: 50,
                typeParams: { min: 1, max: 125 }
            }),
            queryBoolValidator('isRead').optional()
        ];
    }
}

export const getUserNotificationsReq = new GetUserNotificationsRequest().send();
