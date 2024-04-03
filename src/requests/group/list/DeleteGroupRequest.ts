import { param, ValidationChain } from "express-validator";
import { AuthReq, AuthRequest } from "@requests/AuthRequest";
import { paramIntValidator } from "@/validators/ParamBaseValidator";

export interface DeleteGroupReq extends AuthReq {
    params: {
        groupId: number
    }
}

export class DeleteGroupRequest extends AuthRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {

        return [
            paramIntValidator("groupId")
        ]
    }
}