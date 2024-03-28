import { bodyBoolValidator } from "@validators/BodyBaseValidator";
import GetNotificationsRequest from "./GetNotificationsRequest";

export default class GetUserNotificationsRequest extends GetNotificationsRequest {

    /**
     * append ValidationChain to class context
     */
    protected rulesExtend(): void {
        super.rulesExtend()
        this.rulesArr.push([
            bodyBoolValidator({
                fieldName: "isRead",
                message: ""
            })
        ])
    }
}