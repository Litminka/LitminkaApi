import { AuthReq, AuthRequest } from '@requests/AuthRequest';
import prisma from '@/db';
import { GroupList, User } from '@prisma/client';

export interface GroupReq extends AuthReq {
    auth: {
        user: User & {
            ownedGroups: GroupList[];
        };
        id: number;
        token: string;
    };
}

export class GroupRequest extends AuthRequest {
    /**
     *  if authType is not None
     *  Define prisma user request for this method
     *
     *  @returns Prisma User Variant
     */
    protected async auth(userId: number): Promise<any> {
        return await prisma.user.findUserWithOwnedGroups(userId);
    }
}
