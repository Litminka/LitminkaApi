import Request from "@requests/Request";
import { baseMsg, registrationMsg } from '@/ts/messages';
import { body, ValidationChain } from "express-validator";
import prisma from "@/db";
import { bodyStringValidator } from "@/validators/BodyBaseValidator";

export default class RegisterUserRequest extends Request {

    /**
     * append ValidationChain to class context
     */
    protected rules(): ValidationChain[] {

        return [
            bodyStringValidator("login", {
                message: registrationMsg.noLoginProvided
            }).custom(async value => {
                const user = await prisma.user.findFirst({ where: { login: value } })
                if (user) throw new Error(registrationMsg.loginTaken);
                return true;
            }),
            bodyStringValidator("email", {
                message: registrationMsg.noEmailProvided
            }).isEmail().bail().withMessage(registrationMsg.invalidEmail)
                .custom(async value => {
                    const user = await prisma.user.findFirst({ where: { email: value } })
                    if (user) throw new Error(registrationMsg.emailTaken);
                    return true;
                })
                .normalizeEmail(),
            bodyStringValidator("name", {
                typeParams: { min: 4 },
                message: registrationMsg.nameTooShort
            }),
            bodyStringValidator("password", {
                typeParams: { min: 5 },
                message: registrationMsg.passwordTooShort
            }),
            bodyStringValidator("passwordConfirm", {
                message: baseMsg.validationFailed
            }).custom((value, { req }) => {
                if (value !== req.body.password)
                    throw new Error(registrationMsg.passwordsDontMatch);
                return true;
            })
        ]
    }
}