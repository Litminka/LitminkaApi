import { GroupListIdValidator } from "@validators/GroupListValidator";
import AuthRequest from "@requests/AuthRequest";

export default class DeleteGroupRequest extends AuthRequest {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return GroupListIdValidator();
    }
}