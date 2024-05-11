import { bodyBoolValidator } from '@/validators/BodyBaseValidator';
import { bodySoftPeriodValidator } from '@/validators/BodyPeriodValidator';
import AuthRequest from '@requests/AuthRequest';
import { ValidationChain } from 'express-validator';

export default class GetUserNotificationsRequest extends AuthRequest {
    public body!: {
        period: Date[];
        isRead: boolean;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [...bodySoftPeriodValidator('period'), bodyBoolValidator('isRead')];
    }
}

export const getUserNotificationsReq = new GetUserNotificationsRequest().send();
