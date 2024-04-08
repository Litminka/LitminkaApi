import { param, ValidationChain } from "express-validator";
import { AuthReq, AuthRequest } from "@requests/AuthRequest";
import { paramIntValidator } from "@validators/ParamBaseValidator";

export interface GroupMemberReq extends AuthReq {
    params: {
        groupId: number,
    }
}

export class GroupMemberRequest extends AuthRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            paramIntValidator("groupId"),
        ];
    }
}