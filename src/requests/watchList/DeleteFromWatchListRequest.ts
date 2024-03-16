import { DeleteFromWatchListValidator } from "@validators/WatchListValidator";
import AuthRequest from "@requests/AuthRequest";

export default class DeleteFromWatchListRequest extends AuthRequest {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return DeleteFromWatchListValidator();
    }
}