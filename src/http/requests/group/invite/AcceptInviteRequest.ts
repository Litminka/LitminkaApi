import { ValidationChain } from "express-validator";
import { GroupInviteReq, GroupInviteRequest } from "@requests/group/GroupInviteRequest";
import { bodyBoolValidator } from "@validators/BodyBaseValidator";
import { paramIntValidator } from "@validators/ParamBaseValidator";

export interface AcceptInviteReq extends GroupInviteReq {
    params: {
        inviteId: number,
    },
    body: {
        modifyList: boolean,
    }
}

export class AcceptInviteRequest extends GroupInviteRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {

        return [
            paramIntValidator("inviteId"),
            bodyBoolValidator("modifyList", { defValue: true })
        ]
    }
}