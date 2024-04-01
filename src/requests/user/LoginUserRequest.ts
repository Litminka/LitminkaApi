import Request from "@requests/Request";
import { body, ValidationChain } from "express-validator";
import { registrationMsg } from '@/ts/messages';

export default class LoginUserRequest extends Request {

    /**
     * append ValidationChain to class context
     */
    protected rules(): ValidationChain[] {

        return [
            body("login").notEmpty().withMessage(registrationMsg.noLoginProvided).isString(),
            body("password").notEmpty().withMessage(registrationMsg.noPasswordProvided).isString()
        ]
    }
}