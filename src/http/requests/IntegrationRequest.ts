import prisma from '@/db';
import AuthRequest from '@requests/AuthRequest';

export default class IntegrationRequest extends AuthRequest {
    /**
     *  if authType is not None
     *  Define prisma user request for this method
     *
     *  @returns Prisma User Variant
     */
    public async getUser(userId: number) {
        return await prisma.user.findUserById(userId, {
            integration: true
        });
    }
}

export const integrationReq = new IntegrationRequest().send();
