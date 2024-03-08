import { body, param } from "express-validator";
import { validationError } from "../middleware/validationError";

const CreateGroupListValidator = (): any[] => {
    return [
        body("name").notEmpty().bail().isString().bail(),
        body("description").notEmpty().bail().isString().bail(),
        validationError
    ];
};
const GroupInviteValidator = (): any[] => {
    return [
        body("user_id").notEmpty().bail().isInt().bail().toInt(),
        ...GroupListIdValidator()
    ];
};

const GroupListIdValidator = (): any[] => {
    return [
        param("group_id").notEmpty().bail().isInt().bail().toInt(),
        validationError
    ];
};
const GroupInviteIdValidator = (): any[] => {
    return [
        param("invite_id").notEmpty().bail().isInt().bail().toInt(),
        validationError
    ]
}

const GroupInviteActionValidator = (): any[] => {
    return [
        param("invite_id").notEmpty().bail().isInt().bail().toInt(),
        body("modifyList").optional().isBoolean().bail().toBoolean(),
        validationError
    ];
}

export { CreateGroupListValidator, GroupListIdValidator, GroupInviteValidator, GroupInviteActionValidator, GroupInviteIdValidator }