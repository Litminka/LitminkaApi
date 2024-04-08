import { bodyArrayValidator, bodyIntValidator } from '@validators/BodyBaseValidator';
import { AuthReq, AuthRequest } from '@requests/AuthRequest';
import { ValidationChain } from 'express-validator';

export interface ReadNotificationsReq extends AuthReq {
    body: {
        id?: number[];
    };
}

export class ReadNotificationsRequest extends AuthRequest {
    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [bodyArrayValidator('id').optional(), bodyIntValidator('id.*')];
    }
}
