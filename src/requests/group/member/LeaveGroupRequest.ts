import { param } from "express-validator";
import AuthRequest from "@requests/AuthRequest";


export default class LeaveGroupRequest extends AuthRequest {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return [
            param("groupId").isInt().bail().toInt(),
        ]
    }
}