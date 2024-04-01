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
    protected rules(): ValidationChain[] {

        return [
            bodyBoolValidator("shikimori", {
                message: baseMsg.valueMustBeBool
            }).optional()
        ]
    }
}