import prisma from "@/db";
import { body } from "express-validator";
import GroupMemberRequest from "./GroupMemberRequest";

export default class KickGroupMemberRequest extends GroupMemberRequest {

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
            body("userId").isInt().bail().toInt(),
        ])
    }
}