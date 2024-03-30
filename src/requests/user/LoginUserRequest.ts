import Request from "@requests/Request";
import { body } from "express-validator";
import { registrationMsg } from '@/ts/messages';
import { bodyStringValidator } from "@/validators/BodyBaseValidator";

export default class LoginUserRequest extends Request {

    /**
     * append ValidationChain to class context
     */
    protected rulesExtend(): void {
        super.rulesExtend();
        this.rulesArr.push([
            //body("login").notEmpty().withMessage(registrationMsg.noLoginProvided).isString(),
            bodyStringValidator({
                fieldName: "login",
                ifEmptyMessage: registrationMsg.noLoginProvided
            }),
            //body("password").notEmpty().withMessage(registrationMsg.noPasswordProvided).isString()
            bodyStringValidator({
                fieldName: "password",
                ifEmptyMessage: registrationMsg.noPasswordProvided
            })
        ])
    }
}