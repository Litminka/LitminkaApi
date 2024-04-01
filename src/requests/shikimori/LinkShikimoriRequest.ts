import Request from "@requests/Request";
import { query, ValidationChain } from "express-validator";

export default class LinkShikimoriRequest extends Request {

    /**
     * append ValidationChain to class context
     */
    protected rules(): ValidationChain[] {

        return [
            query("token").notEmpty().isString().bail(),
            query("code").notEmpty().isString().bail()
        ]
    }
}