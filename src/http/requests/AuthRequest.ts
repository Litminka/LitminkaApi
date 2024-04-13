import prisma from '@/db';
import { RequestAuthTypes } from '@enums';
import { User } from '@prisma/client';
import Request from '@requests/Request';

export interface AuthReq {
    auth: {
        user: User;
        id: number;
        token: string;
    };
}

export class AuthRequest extends Request {
    /**
     * Define auth type for this request
     */
    protected authType = RequestAuthTypes.Auth;

    /**
     *  if authType is not None
     *  Define prisma user request for this method
     *
     *  @returns Prisma User Variant
     */
    protected async auth(userId: number): Promise<any> {
        return await prisma.user.findUserById(userId);
    }
}
