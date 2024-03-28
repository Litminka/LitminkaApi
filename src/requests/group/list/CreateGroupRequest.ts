import prisma from "@/db";
import AuthRequest from "@requests/AuthRequest";
import { body } from "express-validator";

export default class CreateGroupRequest extends AuthRequest {

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
            body("name").notEmpty().bail().isString().bail(),
            body("description").notEmpty().bail().isString().bail(),
        ])
    }
}