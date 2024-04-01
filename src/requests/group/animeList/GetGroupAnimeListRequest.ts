import { body, param, ValidationChain } from "express-validator";
import prisma from "@/db";
import GroupRequest from "@requests/group/GroupRequest";

export default class GetGroupAnimeListRequest extends GroupRequest {

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            param("groupId").isInt().bail().toInt(),
            body("statuses").optional().toArray(),
            body("statuses.*").notEmpty().bail().isIn(["planned", "watching", "rewatching", "completed", "on_hold", "dropped"]),
            body("ratings").optional().toArray(),
            body("ratings.*").notEmpty().bail().isInt({ min: 0, max: 10 }),
            body("isFavorite").optional().notEmpty().bail().isBoolean().bail().toBoolean()
        ]
    }
}