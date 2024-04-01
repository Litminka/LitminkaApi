import { param } from "express-validator";
import AuthRequest from "@requests/AuthRequest";

export default class DeleteGroupRequest extends AuthRequest {

    /**
     * append ValidationChain to class context
     */
    protected rules(): ValidationChain[] {

        return [
            param("groupId").isInt().bail().toInt()
        ]
    }
}