import prisma from '@/db';
import { validation } from '@/ts/messages';
import { body } from "express-validator";

const registration = validation.errors.registration;

export const RegistrationValidator = (): any[] => {
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
};

export const LoginValidator = (): any[] => {
    return [
        body("login").notEmpty().withMessage(registration.noLoginProvided).isString(),
        body("password").notEmpty().withMessage(registration.noPasswordProvided).isString()
    ];
};
