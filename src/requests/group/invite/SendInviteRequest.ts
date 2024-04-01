import AuthRequest from "@requests/AuthRequest";
import prisma from "@/db";
import { body, param } from "express-validator";

export default class SendInviteRequest extends AuthRequest {

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
            body("userId").isInt().bail().toInt(),
        ]
    }
}