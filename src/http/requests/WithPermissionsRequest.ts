import prisma from '@/db';
import { UserWithPermissions } from '@/ts';
import { AuthRequest } from '@requests/AuthRequest';

export interface WithPermissionsReq {
    auth: {
        user: UserWithPermissions;
        id: number;
    };
}

export class WithPermissionsRequest extends AuthRequest {
    /**
     *  if authType is not None
     *  Define prisma user request for this method
     *
     *  @returns Prisma User Variant
     */
    protected async auth(userId: number): Promise<any> {
        return await prisma.user.findUserByIdWithRolePermission(userId);
    }
}
