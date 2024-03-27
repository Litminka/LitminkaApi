import AuthRequest from "@requests/AuthRequest";
import { body } from "express-validator";


export default class EndSessionRequest extends AuthRequest {


    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return [
            body('sessions').optional().isArray({ min: 1, max: 100 }),
            body('sessions.*').isUUID().withMessage('invalid_session_token'),
        ]
    }
}