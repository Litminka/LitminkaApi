import { ValidationChain } from "express-validator";
import { AuthReq, AuthRequest } from "@requests/AuthRequest";
import { paramIntValidator } from "@validators/ParamBaseValidator";
import { bodyStringValidator } from "@validators/BodyBaseValidator";
import { FollowTypes } from "@/ts/enums";

export interface FollowAnimeReq extends AuthReq {
    params: {
        animeId: number
    },
    body: {
        type: FollowTypes,
        groupName: string
    }
}

export class FollowAnimeRequest extends AuthRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            paramIntValidator("animeId"),
            bodyStringValidator("type").isIn(["announcement", "follow"]).bail(),
            bodyStringValidator("groupName").optional()
        ];
    }
}