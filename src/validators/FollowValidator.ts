import { body, param } from "express-validator";

const FollowValidation = (): any[] => {
    return [
        body("type").bail().notEmpty().isString().isIn(["announcement", "follow"]).bail(),
        body("group_name").optional().notEmpty().isString().bail(),
        param("anime_id").notEmpty().bail().isInt().bail().toInt()
    ];
};


export { FollowValidation };