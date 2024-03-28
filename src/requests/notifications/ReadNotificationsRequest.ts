import { bodyArrayValidator, bodyIntValidator } from "@validators/BodyBaseValidator";
import AuthRequest from "@requests/AuthRequest";

export default class ReadNotificationsRequest extends AuthRequest {

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