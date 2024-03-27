import { bodySoftPeriodValidator } from "@/validators/BodyPeriodValidator";
import { bodyBoolValidator } from "@validators/BodyBaseValidator";
import AuthRequest from "@requests/AuthRequest";

export default class GetUserNotificationsRequest extends AuthRequest {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return [
            ...
            bodySoftPeriodValidator({ fieldName: 'period', message: "" }),
            bodyBoolValidator({ fieldName: 'isRead', message: "" })
        ];
    }
}