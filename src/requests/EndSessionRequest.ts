import { searchMsg, sessionMsg } from "@/ts/messages";
import { bodyArrayValidator, bodyUUIDValidator } from "@/validators/BodyBaseValidator";
import AuthRequest from "@requests/AuthRequest";


export default class EndSessionRequest extends AuthRequest {

    /**
     * append ValidationChain to class context
     */
    protected rulesExtend(): void {
        super.rulesExtend()
        this.rulesArr.push([
            bodyArrayValidator("sessions", {
                typeParams: { min: 1, max: 100 },
                message: searchMsg.maxArraySizeExceeded
            }).optional(),
            bodyUUIDValidator("sessions.*", {
                message: sessionMsg.invalidSessionToken
            })
        ])
    }
}