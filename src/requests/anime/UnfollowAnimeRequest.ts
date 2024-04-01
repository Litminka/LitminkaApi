import { param, body, ValidationChain } from "express-validator";
import AuthRequest from "@requests/AuthRequest";

export default class UnFollowAnimeRequest extends AuthRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            param("animeId").bail().isInt().bail().toInt(),
            body("groupName").optional().isString().bail(),
        ]
    }
}