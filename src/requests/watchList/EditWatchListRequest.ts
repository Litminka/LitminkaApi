import { EditWatchListValidation } from "../../validators/WatchListValidator";
import AuthRequest from "../AuthRequest";

export default class EditWatchListRequest extends AuthRequest {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return EditWatchListValidation();
    }
}