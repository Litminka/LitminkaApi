import prisma from '@/db';
import { RequestAuthTypes } from '@enums';
import Request from '@requests/Request';

export default class AuthRequest extends Request {
    /**
     * Define auth type for this request
     */
    protected authType = RequestAuthTypes.Auth;
    public auth!: {
        id: number;
        token: string;
    };
    public user!: Awaited<ReturnType<this['getUser']>>;

    /**
     *  if authType is not None
     *  Define prisma user request for this method
     *
     *  @returns Prisma User Variant
     */
    public async getUser(userId: number) {
        return await prisma.user.findUserWithoutPassword(userId);
    }
}

export const authReq = new AuthRequest().send();
