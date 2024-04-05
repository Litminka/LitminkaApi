import Request from "@requests/Request";
import { query, ValidationChain } from "express-validator";
import { Request as ExpressRequest } from "express";
import { queryIntValidator, queryStringValidator } from "@/validators/QueryBaseValidator";

export interface LinkShikimoriReq extends ExpressRequest {
    query: {
        token: string,
        code: string,
    }
}

export class LinkShikimoriRequest extends Request {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            queryStringValidator("token"),
            queryStringValidator("code"),
        ]
    }
}