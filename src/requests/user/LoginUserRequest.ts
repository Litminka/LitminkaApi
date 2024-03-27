import Request from "@requests/Request";
import { body } from "express-validator";
import { registrationMsg } from '@/ts/messages';

export default class LoginUserRequest extends Request {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return [
            body("login").notEmpty().withMessage(registrationMsg.noLoginProvided).isString(),
            body("password").notEmpty().withMessage(registrationMsg.noPasswordProvided).isString()
        ];
    }
}