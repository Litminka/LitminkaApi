import { param, body, ValidationChain } from "express-validator";
import GroupRequest from "@requests/group/GroupRequest";

export default class KickGroupMemberRequest extends GroupRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            param("groupId").isInt().bail().toInt(),
            body("userId").isInt().bail().toInt()
        ]
    }
}