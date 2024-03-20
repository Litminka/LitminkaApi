import { RequestAuthTypes } from "@/ts/enums";
import Request from "@requests/Request";
import { bodyBoolValidator } from "@validators/BaseValidator";

export default class GetTopAnimeRequest extends Request {

    /**
     * Define auth type for this request
     */
    protected authType = RequestAuthTypes.None;

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return [
            bodyBoolValidator({
                fieldName: "shikimori",
                message: "requires_bool"
            }).optional()
        ]
    }
}