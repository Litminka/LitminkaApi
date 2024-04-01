import { paramIntValidator } from "@validators/ParamBaseValidator";
import { baseMsg } from "@/ts/messages"
import { ValidationChain } from "express-validator";
import { RequestAuthTypes } from "@/ts/enums";
import IntegrationRequest from "@/requests/IntegrationRequest";

export default class GetSingleAnimeRequest extends IntegrationRequest {

    /**
     * Define auth type for this request
     */
    protected authType = RequestAuthTypes.Optional;

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            paramIntValidator("animeId", {
                message: baseMsg.valueNotInRange
            })
        ]
    }
}