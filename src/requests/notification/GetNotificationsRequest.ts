import { bodySoftPeriodValidator } from "@validators/BodyPeriodValidator";
import { Request as ExpressRequest } from "express";
import { ValidationChain } from "express-validator";
import Request from "../Request";

export interface GetNotificationsReq extends ExpressRequest {
    body: {
        period: Date[],
    }
}

export class GetNotificationsRequest extends Request {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            ...bodySoftPeriodValidator("period")
        ]
    }
}
