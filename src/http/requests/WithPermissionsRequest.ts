import prisma from '@/db';
import AuthRequest from '@requests/AuthRequest';

export default class WithPermissionsRequest extends AuthRequest {
    /**
     *  if authType is not None
     *  Define prisma user request for this method
     *
     *  @returns Prisma User Variant
     */
    public async getUser(userId: number) {
        return await prisma.user.findUserByIdWithIntegration(userId);
    }
}

export const withPermissionsReq = new WithPermissionsRequest().send();
