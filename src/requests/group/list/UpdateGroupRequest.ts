import prisma from "@/db";
import AuthRequest from "@requests/AuthRequest";
import { body, param } from "express-validator";

export default class UpdateGroupRequest extends AuthRequest {

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
    protected rulesExtend(): void {
        super.rulesExtend()
        this.rulesArr.push([
            param("groupId").isInt().bail().toInt(),
            body("name").optional().notEmpty().bail().isString().bail(),
            body("description").optional().notEmpty().bail().isString().bail(),
        ])
    }
}