import Request from "@requests/Request";
import { validation } from '@/ts/messages';
import { body } from "express-validator";
import prisma from "@/db";
const registration = validation.errors.registration;

export default class RegisterUserRequest extends Request {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return [
            body("login")
                .notEmpty().bail().withMessage(registration.noLoginProvided)
                .custom(async value => {
                    const user = await prisma.user.findFirst({  where: { login: value } })
                    if (user) throw new Error(registration.loginTaken);
                    return true;
                }),
            body("email")
                .notEmpty().bail().withMessage(registration.noEmailProvided)
                .isEmail().bail().withMessage(registration.invalidEmail)
                .custom(async value => {
                    const user = await prisma.user.findFirst({ where: { email: value } })
                    if (user) throw new Error(registration.emailTaken);
                    return true;
                })
                .normalizeEmail(),
            body("name").optional().isLength({ min: 4 }).withMessage(registration.nameTooShort),
            body("password").isLength({ min: 5 }).withMessage(registration.passwordTooShort),
            body("passwordConfirm").custom((value, { req }) => {
                if (value !== req.body.password) 
                    throw new Error(registration.passwordsDontMatch);
                return true;
            })
        ];
    }
}