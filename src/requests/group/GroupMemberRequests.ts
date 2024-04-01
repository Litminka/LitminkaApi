import { param, body, ValidationChain } from "express-validator";
import AuthRequest from "@requests/AuthRequest";
import prisma from "@/db";

export class BaseGroupMemberRequest extends AuthRequest {

    /**
     * append ValidationChain to class context
     */
    protected rules(): ValidationChain[] {

        return [
            param("groupId").isInt().bail().toInt()
        ]
    }
}
export class KickGroupMemberRequest extends AuthRequest {

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
            body("userId").isInt().bail().toInt()
        ]
    }
}