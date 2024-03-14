import { query } from "express-validator";

export const ShikimoriLinkValidation = (): any[] => {
    return [
        query("token").notEmpty().isString().bail(),
        query("code").notEmpty().isString().bail()
    ];
};