import { GetUserNotificationsValidation } from "@validators/NotificationValidator";
import AuthRequest from "@requests/AuthRequest";

export default class GetUserNotificationsRequest extends AuthRequest {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return GetUserNotificationsValidation();
    }
}