import AuthRequest from "@requests/AuthRequest";
import prisma from "@/db";
import { body, param } from "express-validator";

export default class DenyInviteRequest extends AuthRequest {

    /**
     *  if authType is not None 
     *  Define prisma user request for this method
     * 
     *  @returns Prisma User Variant
     */
    protected async auth(userId: number): Promise<any> {
        return await prisma.user.findUserWithGroupInvites(userId);
    }

    /**
     * append ValidationChain to class context
     */
    protected rules(): ValidationChain[] {

        return [
            param("inviteId").isInt().bail().toInt(),
            body("modifyList").optional().isBoolean().bail().toBoolean(),
        ]
    }
}