import Request from "@requests/Request";
import { query } from "express-validator";

export default class LinkShikimoriRequest extends Request {

    /**
     * append ValidationChain to class context
     */
    protected rulesExtend(): void {
        super.rulesExtend()
        this.rulesArr.push([
            query("token").notEmpty().isString().bail(),
            query("code").notEmpty().isString().bail()
        ])
    }
}