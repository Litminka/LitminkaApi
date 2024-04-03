import Request from "@requests/Request";
import { Request as ExpressRequest } from "express";
import { ValidationChain } from "express-validator";
import { bodyStringValidator } from "@/validators/BodyBaseValidator";

export interface LoginUserReq extends ExpressRequest {
    body: {
        login: string,
        email: string,
        name: string,
        password: string,
        passwordConfirm: string
    }
}

export default class LoginUserRequest extends Request {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            bodyStringValidator("login"),
            bodyStringValidator("password"),
        ]
    }
}