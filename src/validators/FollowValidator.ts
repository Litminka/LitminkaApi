import { body, param } from "express-validator";

export const FollowValidation = (): any[] => {
    return [
        param("animeId").bail().isInt().bail().toInt(),
        body("type").notEmpty().bail().isString().bail().isIn(["announcement", "follow"]).bail(),
        body("groupName").if(body("type").exists().bail().equals('follow')).notEmpty().bail().isString().bail(),
    ];
};

export const UnFollowValidation = (): any[] => {
    return [
        param("animeId").bail().isInt().bail().toInt(),
        body("groupName").optional().isString().bail(),
    ];
};
