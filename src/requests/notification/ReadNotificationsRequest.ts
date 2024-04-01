import { bodyArrayValidator, bodyIntValidator } from "@validators/BodyBaseValidator";
import AuthRequest from "@requests/AuthRequest";
import { baseMsg } from "@/ts/messages";
import { ValidationChain } from "express-validator";

export default class ReadNotificationsRequest extends AuthRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            bodyArrayValidator("id", {
                message: baseMsg.validationFailed
            }).optional(),
            bodyIntValidator("id.*", {
                message: baseMsg.validationFailed
            })
        ]
    }
}