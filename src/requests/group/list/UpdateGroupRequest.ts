import { body, param, ValidationChain } from "express-validator";
import GroupRequest from "@requests/group/GroupRequest";

export default class UpdateGroupRequest extends GroupRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {

        return [
            param("groupId").isInt().bail().toInt(),
            body("name").optional().notEmpty().bail().isString().bail(),
            body("description").optional().notEmpty().bail().isString().bail(),
        ]
    }
}