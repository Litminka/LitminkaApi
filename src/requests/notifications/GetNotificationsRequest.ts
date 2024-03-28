import { bodySoftPeriodValidator } from "@/validators/BodyPeriodValidator";
import AuthRequest from "@requests/AuthRequest";

export default class GetNotificationsRequest extends AuthRequest {

    /**
     * append ValidationChain to class context
     */
    protected rulesExtend(): void {
        super.rulesExtend()
        this.rulesArr.push([
            bodySoftPeriodValidator({
                fieldName: "period",
                message: ""
            })
        ])
    }
}