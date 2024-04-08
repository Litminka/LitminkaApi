import { sessionMsg } from "@/ts/messages";
import { bodyArrayValidator, bodyUUIDValidator } from "@validators/BodyBaseValidator";
import { AuthReq, AuthRequest } from "@requests/AuthRequest";
import { ValidationChain } from "express-validator";

export interface EndSessionReq extends AuthReq {
    body: {
        sessions?: string[]
    }
}

export class EndSessionRequest extends AuthRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            bodyArrayValidator("sessions", {
                typeParams: { min: 1, max: 100 },
            }).optional(),
            bodyUUIDValidator("sessions.*", {
                message: sessionMsg.invalidSessionToken
            })
        ];
    }
}