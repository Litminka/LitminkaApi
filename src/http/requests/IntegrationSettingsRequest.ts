import AuthRequest from '@requests/AuthRequest';
import prisma from '@/db';

export default class IntegrationSettingsRequest extends AuthRequest {
    /**
     *  Define prisma user request for this method
     *
     *  @returns Prisma User Variant
     */
    public async getUser(userId: number) {
        return await prisma.user.findWithIntegrationSettings(userId);
    }
}

export const integrationSettingsReq = new IntegrationSettingsRequest().send();
