import { bodyBoolValidator } from "@validators/BodyBaseValidator";
import { bodySoftPeriodValidator } from "@/validators/BodyPeriodValidator";
import { bodyArrayValidator, bodyIntValidator } from "@validators/BodyBaseValidator";
import AuthRequest from "@requests/AuthRequest";
import { baseMsg } from "@/ts/messages";

export class GetNotificationsRequest extends AuthRequest {

    /**
     * append ValidationChain to class context
     */
    protected rulesExtend(): void {
        super.rulesExtend()
        this.rulesArr.push([
            bodySoftPeriodValidator("period", {
                message: baseMsg.validationFailed
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
            bodySoftPeriodValidator("period", {
                message: baseMsg.validationFailed
            }),
            bodyBoolValidator("isRead", {
                message: baseMsg.validationFailed
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
            bodyArrayValidator("id", {
                message: baseMsg.validationFailed
            }).optional(),
            bodyIntValidator("id.*", {
                message: baseMsg.validationFailed
            })
        ])
    }
}