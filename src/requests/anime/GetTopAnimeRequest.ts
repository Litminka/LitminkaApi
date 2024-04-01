import Request from "@requests/Request";
import { bodyBoolValidator } from "@validators/BodyBaseValidator";
import { baseMsg } from '@/ts/messages';
import { ValidationChain } from "express-validator";

export default class GetTopAnimeRequest extends Request {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            bodyBoolValidator("shikimori", {
                message: baseMsg.valueMustBeBool
            }).optional()
        ]
    }
}