import { Permissions } from "@/ts/enums";
import { body, param, ValidationChain } from "express-validator";
import AuthRequest from "@requests/AuthRequest";

export default class FollowAnimeRequest extends AuthRequest {

    protected permissions: string[] = [Permissions.ManageAnime];

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            param("animeId").bail().isInt().bail().toInt(),
            body("type").notEmpty().bail().isString().bail().isIn(["announcement", "follow"]).bail(),
            body("groupName").if(body("type").exists().bail().equals('follow')).notEmpty().bail().isString().bail()
        ]
    }
}