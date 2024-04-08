import { ValidationChain } from "express-validator";
import { GroupReq, GroupRequest } from "@requests/group/GroupRequest";
import { paramIntValidator } from "@validators/ParamBaseValidator";
import { bodyIntValidator } from "@validators/BodyBaseValidator";

export interface SendInviteReq extends GroupReq {
    params: {
        groupId: number,
    },
    body: {
        userId: number
    }
}

export class SendInviteRequest extends GroupRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {

        return [
            paramIntValidator("groupId"),
            bodyIntValidator("userId"),
        ];
    }
}