import prisma from '@/db';
import { RequestAuthTypes } from '@enums';
import Request from '@requests/Request';

export default class OptionalRequest extends Request {
    /**
     * Define auth type for this request
     */
    protected authType = RequestAuthTypes.Optional;
    public user: Awaited<ReturnType<this['getUser']>> | undefined;
    /**
     *  if authType is not None
     *  Define prisma user request for this method
     *
     *  @returns Prisma User Variant
     */
    public async getUser(userId: number) {
        return await prisma.user.findUserById(userId);
    }
}

export const optionalReq = new OptionalRequest().send();
