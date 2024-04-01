import Request from "@requests/Request";
import { query, ValidationChain } from "express-validator";

export default class LinkShikimoriRequest extends Request {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            query("token").notEmpty().isString().bail(),
            query("code").notEmpty().isString().bail()
        ]
    }
}