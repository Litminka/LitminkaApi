import prisma from '@/db';
import { UserWithIntegration } from '@/ts/user';
import { AuthRequest } from '@requests/AuthRequest';

export interface IntegrationReq {
    auth: {
        user: UserWithIntegration;
        id: number;
    };
}

export class IntegrationRequest extends AuthRequest {
    /**
     *  if authType is not None
     *  Define prisma user request for this method
     *
     *  @returns Prisma User Variant
     */
    protected async auth(userId: number): Promise<any> {
        return await prisma.user.findUserByIdWithIntegration(userId);
    }
}
