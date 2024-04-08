import { ValidationChain } from "express-validator";
import { GroupReq, GroupRequest } from "@requests/group/GroupRequest";
import { paramIntValidator } from "@validators/ParamBaseValidator";
import { bodyBoolValidator, bodyIntValidator } from "@validators/BodyBaseValidator";

export interface UpdateGroupMemberReq extends GroupReq {
    params: {
        groupId: number,
    },
    body: {
        userId: number
        modifyList: boolean,
    }
}

export class UpdateGroupMemberRequest extends GroupRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            paramIntValidator("groupId"),
            bodyIntValidator("userId"),
            bodyBoolValidator("modifyList")
        ];
    }
}