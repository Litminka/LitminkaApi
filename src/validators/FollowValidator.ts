import { body, param } from "express-validator";
import { validationError } from "../middleware/validationError";

const FollowValidation = (): any[] => {
    return [
        body("type").notEmpty().bail().isString().bail().isIn(["announcement", "follow"]).bail(),
        body("group_name").if(body("type").exists().bail().equals('follow')).notEmpty().bail().isString().bail(),
        param("anime_id").notEmpty().bail().isInt().bail().toInt(),
        validationError
    ];
};

const UnFollowValidation = (): any[] => {
    return [
        body("group_name").optional().isString().bail(),
        param("anime_id").notEmpty().bail().isInt().bail().toInt(),
        validationError,
    ];
};

export { FollowValidation, UnFollowValidation };