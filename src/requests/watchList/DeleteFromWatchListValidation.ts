import { DeleteFromWatchListValidation } from "../../validators/WatchListValidator";
import AuthRequest from "../AuthRequest";

export default class DeleteFromWatchListRequest extends AuthRequest {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return DeleteFromWatchListValidation();
    }
}