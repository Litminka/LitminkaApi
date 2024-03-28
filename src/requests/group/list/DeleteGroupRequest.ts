import { param } from "express-validator";
import AuthRequest from "@requests/AuthRequest";

export default class DeleteGroupRequest extends AuthRequest {

    /**
     * append ValidationChain to class context
     */
    protected rulesExtend(): void {
        super.rulesExtend()
        this.rulesArr.push([
            param("groupId").isInt().bail().toInt()
        ])
    }
}