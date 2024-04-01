import { bodySoftPeriodValidator } from "@validators/BodyPeriodValidator";
import AuthRequest from "@requests/AuthRequest";
import { baseMsg } from "@/ts/messages";
import { ValidationChain } from "express-validator";

export default class GetNotificationsRequest extends AuthRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            ...bodySoftPeriodValidator("period", {
                message: baseMsg.validationFailed
            })
        ]
    }
}
