import { paramIntValidator } from "@validators/ParamBaseValidator";
import { ValidationChain } from "express-validator";
import { RequestAuthTypes } from "@/ts/enums";
import { IntegrationReq, IntegrationRequest } from "@/requests/IntegrationRequest";
import { OptionalReq } from "../OptionalRequest";

export interface GetSingleAnimeReq extends OptionalReq {
    auth?: IntegrationReq['auth'],
    params: {
        animeId: number
    }
}

export class GetSingleAnimeRequest extends IntegrationRequest {

    /**
     * Define auth type for this request
     */
    protected authType = RequestAuthTypes.Optional;

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            paramIntValidator("animeId")
        ]
    }
}