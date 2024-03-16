import { AddToWatchListValidation } from "@validators/WatchListValidator";
import AuthRequest from "@requests/AuthRequest";


export default class AddToWatchListRequest extends AuthRequest {

    /**
    * define validation rules for this request
    * @returns ValidationChain
    */
    protected rules(): any[] {
        return AddToWatchListValidation();
    }
}