import { body, param, ValidationChain } from "express-validator";
import AuthRequest from "@requests/AuthRequest";
import prisma from "@/db";

export default class GetGroupAnimeListRequest extends AuthRequest {

    /**
     *  if authType is not None 
     *  Define prisma user request for this method
     * 
     *  @returns Prisma User Variant
     */
    protected async auth(userId: number): Promise<any> {
        return await prisma.user.findUserWithOwnedGroups(userId);
    }

    /**
     * append ValidationChain to class context
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