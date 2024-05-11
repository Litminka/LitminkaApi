import AuthRequest from '@requests/AuthRequest';
import prisma from '@/db';

export default class GroupInviteRequest extends AuthRequest {
    /**
     *  if authType is not None
     *  Define prisma user request for this method
     *
     *  @returns Prisma User Variant
     */
    public async getUser(userId: number) {
        return await prisma.user.findUserWithGroupInvites(userId);
    }
}

export const groupInviteReq = new GroupInviteRequest().send();
