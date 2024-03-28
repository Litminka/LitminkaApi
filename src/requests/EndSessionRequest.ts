import { searchMsg, sessionMsg } from "@/ts/messages";
import { bodyArrayValidator, bodyUUIDValidator } from "@/validators/BodyBaseValidator";
import AuthRequest from "@requests/AuthRequest";


export default class EndSessionRequest extends AuthRequest {


    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return [
            bodyArrayValidator({
                fieldName: "sessions",
                typeParams: { min: 1, max: 100 },
                message: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyUUIDValidator({
                fieldName: "sessions.*",
                message: sessionMsg.invalidSessionToken
            })
        ]
    }
}