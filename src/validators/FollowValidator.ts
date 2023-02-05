import { body, param } from "express-validator";

const FollowValidation = (): any[] => {
    return [
        body("group_name").bail().notEmpty().isString().bail(),
        param("anime_id").notEmpty().bail().isInt().bail().toInt()
    ];
};


export { FollowValidation };