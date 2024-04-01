import { searchMsg, sessionMsg } from "@/ts/messages";
import { bodyArrayValidator, bodyUUIDValidator } from "@validators/BodyBaseValidator";
import AuthRequest from "@requests/AuthRequest";
import { ValidationChain } from "express-validator";


export default class EndSessionRequest extends AuthRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            bodyArrayValidator("sessions", {
                typeParams: { min: 1, max: 100 },
                message: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyUUIDValidator("sessions.*", {
                message: sessionMsg.invalidSessionToken
            })
        ]
    }
}