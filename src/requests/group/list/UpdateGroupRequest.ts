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
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return [
            param("groupId").isInt().bail().toInt(),
            body("name").optional().notEmpty().bail().isString().bail(),
            body("description").optional().notEmpty().bail().isString().bail(),
        ];
    }
}