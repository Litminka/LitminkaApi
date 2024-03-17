import { query } from "express-validator";

export const ShikimoriLinkValidator = (): any[] => {
    return [
        query("token").notEmpty().isString().bail(),
        query("code").notEmpty().isString().bail()
    ];
};