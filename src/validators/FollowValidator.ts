import { body, param } from "express-validator";
import { validationError } from "../middleware/validationError";

const FollowValidation = (): any[] => {
    return [
        param("animeId").bail().isInt().bail().toInt(),
        body("type").notEmpty().bail().isString().bail().isIn(["announcement", "follow"]).bail(),
        body("groupName").if(body("type").exists().bail().equals('follow')).notEmpty().bail().isString().bail(),
        validationError
    ];
};

const UnFollowValidation = (): any[] => {
    return [
        param("animeId").bail().isInt().bail().toInt(),
        body("groupName").optional().isString().bail(),
        validationError,
    ];
};

export { FollowValidation, UnFollowValidation };