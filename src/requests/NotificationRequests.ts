import { bodyBoolValidator } from "@validators/BodyBaseValidator";
import { bodySoftPeriodValidator } from "@/validators/BodyPeriodValidator";
import { bodyArrayValidator, bodyIntValidator } from "@validators/BodyBaseValidator";
import AuthRequest from "@requests/AuthRequest";

export class GetNotificationsRequest extends AuthRequest {

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

export class GetUserNotificationsRequest extends AuthRequest {

    /**
     * append ValidationChain to class context
     */
    protected rulesExtend(): void {
        super.rulesExtend()
        this.rulesArr.push([
            bodySoftPeriodValidator({
                fieldName: "period",
                message: ""
            }),
            bodyBoolValidator({
                fieldName: "isRead",
                message: ""
            })
        ])
    }
}

export class ReadNotificationsRequest extends AuthRequest {

    /**
     * append ValidationChain to class context
     */
    protected rulesExtend(): void {
        super.rulesExtend()
        this.rulesArr.push([
            bodyArrayValidator({
                fieldName: "id",
                message: ""
            }).optional(),
            bodyIntValidator({
                fieldName: "id.*",
                message: ""
            })
        ])
    }
}