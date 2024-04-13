import { bodyBoolValidator } from '@/validators/BodyBaseValidator';
import { bodySoftPeriodValidator } from '@/validators/BodyPeriodValidator';
import { AuthReq, AuthRequest } from '@requests/AuthRequest';
import { ValidationChain } from 'express-validator';

export interface GetUserNotificationsReq extends AuthReq {
    body: {
        period: Date[];
        isRead: boolean;
    };
}

export class GetUserNotificationsRequest extends AuthRequest {
    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [...bodySoftPeriodValidator('period'), bodyBoolValidator('isRead')];
    }
}
