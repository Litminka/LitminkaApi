import Request from "@requests/Request";
import { body } from "express-validator";
import { validation } from '@/ts/messages';
const registration = validation.errors.registration;

export default class LoginUserRequest extends Request {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return [
            body("login").notEmpty().withMessage(registration.noLoginProvided).isString(),
            body("password").notEmpty().withMessage(registration.noPasswordProvided).isString()
        ];
    }
}