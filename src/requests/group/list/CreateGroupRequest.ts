import { body, ValidationChain } from "express-validator";
import GroupRequest from "@requests/group/GroupRequest";

export default class CreateGroupRequest extends GroupRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {

        return [
            body("name").notEmpty().bail().isString().bail(),
            body("description").notEmpty().bail().isString().bail(),
        ]
    }
}