import { ValidationChain } from "express-validator";
import { GroupReq, GroupRequest } from "@requests/group/GroupRequest";
import { paramIntValidator } from "@validators/ParamBaseValidator";
import { bodyStringValidator } from "@validators/BodyBaseValidator";

export interface UpdateGroupReq extends GroupReq {
    params: {
        groupId: number,
    },
    body: {
        name?: string,
        description?: string,
    }
}

export class UpdateGroupRequest extends GroupRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {

        return [
            paramIntValidator("groupId"),
            bodyStringValidator("name").optional(),
            bodyStringValidator("description").optional(),
        ]
    }
}