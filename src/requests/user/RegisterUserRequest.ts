import Request from "@requests/Request";
import { registrationMsg } from '@/ts/messages';
import { body } from "express-validator";
import prisma from "@/db";
import { bodyStringOptionalValidator, bodyStringValidator } from "@/validators/BodyBaseValidator";

export default class RegisterUserRequest extends Request {

    /**
     * append ValidationChain to class context
     */
    protected rulesExtend(): void {
        super.rulesExtend()
        this.rulesArr.push([
            bodyStringValidator({
                fieldName: "login",
                ifEmptyMessage: registrationMsg.noLoginProvided
            }).custom(async value => {
                const user = await prisma.user.findFirst({ where: { login: value } })
                if (user) throw new Error(registrationMsg.loginTaken);
                return true;
            }),
            bodyStringValidator({
                fieldName: "email",
                ifEmptyMessage: registrationMsg.noEmailProvided
            }).isEmail().bail().withMessage(registrationMsg.invalidEmail)
                .custom(async value => {
                    const user = await prisma.user.findFirst({ where: { email: value } })
                    if (user) throw new Error(registrationMsg.emailTaken);
                    return true;
                })
                .normalizeEmail(),
            bodyStringOptionalValidator({
                fieldName: "name",
                typeParams: { min: 4 },
                ifNotTypeParamsMessage: registrationMsg.nameTooShort
            }),
            bodyStringValidator({
                fieldName: "password",
                typeParams: { min: 5 },
                ifNotTypeParamsMessage: registrationMsg.passwordTooShort
            }),
            bodyStringValidator({
                fieldName: "password"
            }).custom((value, { req }) => {
                    if (value !== req.body.password)
                        throw new Error(registrationMsg.passwordsDontMatch);
                    return true;
                })
        ])
    }
}