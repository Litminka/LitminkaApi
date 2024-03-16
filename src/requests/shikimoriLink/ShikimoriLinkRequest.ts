import { ShikimoriLinkValidator } from "@validators/ShikimoriValidator";
import Request from "@requests/Request";

export default class ShikimoriLinkRequest extends Request {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return ShikimoriLinkValidator();
    }
}