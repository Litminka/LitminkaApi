import Request from "@requests/Request";
import { query } from "express-validator";

export default class ShikimoriLinkRequest extends Request {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return [
            query("token").notEmpty().isString().bail(),
            query("code").notEmpty().isString().bail()
        ];
    }
}