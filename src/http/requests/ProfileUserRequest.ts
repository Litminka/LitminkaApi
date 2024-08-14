import { ValidationChain } from 'express-validator';
import prisma from '@/db';
import AuthRequest from '@requests/AuthRequest';

export default class ProfileUserRequest extends AuthRequest {
    protected permissions = [];

    /**
     *  if authType is not None
     *  Define prisma user request for this method
     *
     *  @returns Prisma User Variant
     */
    public async getUser(userId: number) {
        return await prisma.user.findUserById(userId, {
            settings: true,
            integration: {
                select: {
                    discordId: true,
                    id: true,
                    shikimoriCanChangeList: true,
                    shikimoriId: true,
                    telegramId: true,
                    vkId: true
                }
            }
        });
    }

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [];
    }
}

export const profileUserReq = new ProfileUserRequest().send();
