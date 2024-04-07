import { ValidationChain } from "express-validator";
import { Request as ExpressRequest } from "express";
import Request from "@requests/Request";
import { bodyBoolValidator } from "@/validators/BodyBaseValidator";

export interface FrontPageAnimeReq extends ExpressRequest {
    body: {
        withCensored: boolean,
    }
}

export default class FrontPageAnimeRequest extends Request {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {

        return [
            bodyBoolValidator("withCensored", { defValue: false })
        ]
    }
}