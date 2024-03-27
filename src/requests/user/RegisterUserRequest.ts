import Request from "@requests/Request";
import { registrationMsg } from '@/ts/messages';
import { body } from "express-validator";
import prisma from "@/db";

export default class RegisterUserRequest extends Request {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return [
            body("login")
                .notEmpty().bail().withMessage(registrationMsg.noLoginProvided)
                .custom(async value => {
                    const user = await prisma.user.findFirst({  where: { login: value } })
                    if (user) throw new Error(registrationMsg.loginTaken);
                    return true;
                }),
            body("email")
                .notEmpty().bail().withMessage(registrationMsg.noEmailProvided)
                .isEmail().bail().withMessage(registrationMsg.invalidEmail)
                .custom(async value => {
                    const user = await prisma.user.findFirst({ where: { email: value } })
                    if (user) throw new Error(registrationMsg.emailTaken);
                    return true;
                })
                .normalizeEmail(),
            body("name").optional().isLength({ min: 4 }).withMessage(registrationMsg.nameTooShort),
            body("password").isLength({ min: 5 }).withMessage(registrationMsg.passwordTooShort),
            body("passwordConfirm").custom((value, { req }) => {
                if (value !== req.body.password) 
                    throw new Error(registrationMsg.passwordsDontMatch);
                return true;
            })
        ];
    }
}