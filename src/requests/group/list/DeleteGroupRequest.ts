import { GroupListIdValidation } from "../../../validators/GroupListValidator";
import AuthRequest from "../../AuthRequest";

export default class DeleteGroupRequest extends AuthRequest {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return GroupListIdValidation();
    }
}