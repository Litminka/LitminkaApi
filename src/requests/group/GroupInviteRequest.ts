import { AuthReq, AuthRequest } from "@requests/AuthRequest";
import prisma from "@/db";
import { User, GroupListInvites } from "@prisma/client";

export interface GroupInviteReq extends AuthReq {
    auth: {
        user: User & {
            groupInvites: GroupListInvites[],
        },
        id: number,
        token: string
    }
}

export class GroupInviteRequest extends AuthRequest {

    /**
     *  if authType is not None 
     *  Define prisma user request for this method
     * 
     *  @returns Prisma User Variant
     */
    protected async auth(userId: number): Promise<any> {
        return await prisma.user.findUserWithGroupInvites(userId);
    }
}