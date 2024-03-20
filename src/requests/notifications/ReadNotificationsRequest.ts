import { bodyArrayValidator, bodyIdValidator } from "@validators/BaseValidator";
import AuthRequest from "@requests/AuthRequest";

export default class ReadNotificationsRequest extends AuthRequest {

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return [
            bodyArrayValidator({
                fieldName: 'id',
                message: ""
            }).optional(),
            bodyIdValidator({
                fieldName: "id.*",
                message: ""
            })
        ];
    }
}