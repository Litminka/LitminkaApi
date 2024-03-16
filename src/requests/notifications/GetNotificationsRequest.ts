import { GetNotificationsValidation } from "@validators/NotificationValidator";
import AuthRequest from "@requests/AuthRequest";

export default class GetNotificationsRequest extends AuthRequest {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return GetNotificationsValidation();
    }
}