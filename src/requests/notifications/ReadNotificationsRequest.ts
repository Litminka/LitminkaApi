import { ReadNotificationsValidation } from "../../validators/NotificationValidator";
import AuthRequest from "../AuthRequest";

export default class ReadNotificationsRequest extends AuthRequest {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return ReadNotificationsValidation();
    }
}