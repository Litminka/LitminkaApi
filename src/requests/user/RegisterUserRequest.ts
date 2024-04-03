import Request from "@requests/Request";
import { Request as ExpressRequest } from "express";
import { registrationMsg } from '@/ts/messages';
import { ValidationChain } from "express-validator";
import prisma from "@/db";
import { bodyStringValidator } from "@validators/BodyBaseValidator";

export interface RegisterUserReq extends ExpressRequest {
    body: {
        login: string,
        email: string,
        name: string,
        password: string,
        passwordConfirm: string
    }
}

export class RegisterUserRequest extends Request {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            bodyStringValidator("login").custom(async value => {
                const user = await prisma.user.findFirst({ where: { login: value } })
                if (user) throw new Error(registrationMsg.loginTaken);
                return true;
            }),
            bodyStringValidator("email").isEmail().bail().withMessage(registrationMsg.invalidEmail)
                .custom(async value => {
                    const user = await prisma.user.findFirst({ where: { email: value } })
                    if (user) throw new Error(registrationMsg.emailTaken);
                    return true;
                }).normalizeEmail(),
            bodyStringValidator("name", {
                typeParams: { min: 4, max: 50 },
            }),
            bodyStringValidator("password", {
                typeParams: { min: 5, max: 100 },
            }),
            bodyStringValidator("passwordConfirm").custom((value, { req }) => {
                if (value !== req.body.password)
                    throw new Error(registrationMsg.passwordsDontMatch);
                return true;
            })
        ]
    }
}