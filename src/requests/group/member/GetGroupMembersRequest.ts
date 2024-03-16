import AuthRequest from "@requests/AuthRequest";
import { GroupListIdValidation } from "@validators/GroupListValidator";

export default class GetGroupMembersRequest extends AuthRequest {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return GroupListIdValidation();
    }
}