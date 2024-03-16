import AuthRequest from "@requests/AuthRequest";
import { GroupListIdValidation } from "@validators/GroupListValidator";

export default class UpdateMemberStateRequest extends AuthRequest {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return GroupListIdValidation();
    }
}