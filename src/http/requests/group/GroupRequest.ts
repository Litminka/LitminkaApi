import AuthRequest from '@/http/requests/AuthRequest';
import prisma from '@/db';

export default class GroupRequest extends AuthRequest {
    /**
     *  if authType is not None
     *  Define prisma user request for this method
     *
     *  @returns Prisma User Variant
     */
    public async getUser(userId: number) {
        return await prisma.user.findUserById(userId, {
            ownedGroups: true
        });
    }
}

export const groupReq = new GroupRequest().send();
