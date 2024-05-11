import { bodyArrayValidator, bodyIntValidator } from '@/validators/BodyBaseValidator';
import AuthRequest from '@requests/AuthRequest';
import { ValidationChain } from 'express-validator';

export default class ReadNotificationsRequest extends AuthRequest {
    public body!: {
        id?: number[];
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [bodyArrayValidator('id').optional(), bodyIntValidator('id.*')];
    }
}

export const readNotificationsReq = new ReadNotificationsRequest().send();
