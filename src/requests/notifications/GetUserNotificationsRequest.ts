import { bodySoftPeriodValidator } from "@/validators/PeriodValidator";
import { bodyBoolValidator } from "@validators/BaseValidator";
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