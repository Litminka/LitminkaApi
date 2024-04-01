import { body, param, ValidationChain } from "express-validator";
import GroupInviteRequest from "@/requests/group/GroupInviteRequest";

export default class AcceptInviteRequest extends GroupInviteRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {

        return [
            param("inviteId").isInt().bail().toInt(),
            body("modifyList").optional().isBoolean().bail().toBoolean(),
        ]
    }
}