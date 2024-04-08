import Request from "@requests/Request";
import { Request as ExpressRequest } from "express";
import { ValidationChain } from "express-validator";
import { bodyStringValidator } from "@validators/BodyBaseValidator";

export interface LoginUserReq extends ExpressRequest {
    body: {
        login: string,
        password: string,
    }
}

export class LoginUserRequest extends Request {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            bodyStringValidator("login"),
            bodyStringValidator("password"),
        ];
    }
}