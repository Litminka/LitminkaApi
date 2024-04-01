import { param, ValidationChain } from "express-validator";
import AuthRequest from "@requests/AuthRequest";

export default class GroupMemberRequest extends AuthRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            param("groupId").isInt().bail().toInt()
        ]
    }
}