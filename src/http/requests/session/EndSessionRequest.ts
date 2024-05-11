import { tokenMsg } from '@/ts/messages';
import { bodyArrayValidator, bodyUUIDValidator } from '@/validators/BodyBaseValidator';
import AuthRequest from '@requests/AuthRequest';
import { ValidationChain } from 'express-validator';

export default class EndSessionRequest extends AuthRequest {
    public body!: {
        sessions?: string[];
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            bodyArrayValidator('sessions', {
                typeParams: { min: 1, max: 100 }
            }).optional(),
            bodyUUIDValidator('sessions.*', {
                message: tokenMsg.invalid
            })
        ];
    }
}

export const endSessionReq = new EndSessionRequest().send();
