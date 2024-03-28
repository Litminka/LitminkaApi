import { RequestAuthTypes } from "@/ts/enums";
import Request from "@requests/Request";
import { bodyBoolValidator } from "@validators/BodyBaseValidator";
import { baseMsg } from '@/ts/messages';

export default class GetTopAnimeRequest extends Request {

    /**
     * Define auth type for this request
     */
    protected authType = RequestAuthTypes.None;

    /**
     * append ValidationChain to class context
     */
    protected rulesExtend(): void {
        super.rulesExtend()
        this.rulesArr.push([
            bodyBoolValidator({
                fieldName: "shikimori",
                message: baseMsg.requiresBoolean
            }).optional()
        ])
    }
}