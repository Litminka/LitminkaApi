import { prisma } from '../db';
import { body } from "express-validator";

const registrationValidation = (): any[] => {
    return [
        body("login").notEmpty().bail().custom(async value => {
            const user = await prisma.user.findFirst({
                where: { login: value }
            })
            if (user) throw new Error("Login is taken!");
            return true;
        }),
        body("email").isEmail().bail().custom(async value => {
            const user = await prisma.user.findFirst({
                where: { email: value }
            })
            if (user) throw new Error("Email is taken!");
            return true;
        }).normalizeEmail(),
        body("name").optional().isLength({ min: 4 }),
        body("password").isLength({ min: 5 }),
        body("passwordConfirm").custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
    ];
};

const loginValidation = (): any[] => {
    return [
        body("login").notEmpty().isString(),
        body("password").notEmpty().isString(),
    ];
};

export { registrationValidation, loginValidation };