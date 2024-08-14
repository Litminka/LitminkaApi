import { ValidationChain } from 'express-validator';
import AuthRequest from '@requests/AuthRequest';
import { queryBoolValidator } from '@/validators/QueryBaseValidator';

export default class GetUserNotificationsCountRequest extends AuthRequest {
    public query!: {
        page: number;
        pageLimit: number;
        isRead: boolean;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [queryBoolValidator('isRead').optional()];
    }
}

export const GetUserNotificationsCountReq = new GetUserNotificationsCountRequest().send();
