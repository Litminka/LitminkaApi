import { body } from "express-validator";
import prisma from "@/db";
import AuthRequest from "@requests/AuthRequest";

export default class GetWatchListRequest extends AuthRequest {

    /**
     *  if authType is not None 
     *  Define prisma user request for this method
     * 
     *  @returns Prisma User Variant
     */
    protected async auth(userId: number): Promise<any> {
        return await prisma.user.findUserById(userId);
    }

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return [
            body("statuses").optional().toArray(),
            body("statuses.*").notEmpty().bail().isIn(["planned", "watching", "rewatching", "completed", "on_hold", "dropped"]),
            body("ratings").optional().toArray(),
            body("ratings.*").notEmpty().bail().isInt({ min: 0, max: 10 }),
            body("isFavorite").optional().notEmpty().bail().isBoolean().bail().toBoolean()
        ]
    }
}