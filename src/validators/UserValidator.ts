import prisma from '@/db';
import { body } from "express-validator";

export const RegistrationValidator = (): any[] => {
    return [
        body("login").bail().notEmpty().bail().custom(async value => {
            const user = await prisma.user.findFirst({
                where: { login: value }
            })
            if (user) throw new Error("Login is taken!");
            return true;
        }),
        body("email").bail().isEmail().bail().custom(async value => {
            const user = await prisma.user.findFirst({
                where: { email: value }
            })
            if (user) throw new Error("Email is taken!");
            return true;
        }).normalizeEmail(),
        body("name").bail().optional().isLength({ min: 4 }),
        body("password").bail().isLength({ min: 5 }),
        body("passwordConfirm").bail().custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        })
    ];
};

export const LoginValidator = (): any[] => {
    return [
        body("login").notEmpty().isString(),
        body("password").notEmpty().isString()
    ];
};
