import { Permissions } from '@enums';
import { paramIntValidator } from '@/validators/ParamBaseValidator';
import { ValidationChain } from 'express-validator';
import prisma from '@/db';
import AuthRequest from '@requests/AuthRequest';

export default class BanAnimeRequest extends AuthRequest {
    protected permissions = [Permissions.ManageAnime];

    public params!: {
        animeId: number;
    };

    /**
     *  if authType is not None
     *  Define prisma user request for this method
     *
     *  @returns Prisma User Variant
     */
    public async getUser(userId: number) {
        return await prisma.user.findUserById(userId, {
            role: {
                include: { permissions: true }
            },
            integration: true,
            shikimoriLink: true
        });
    }

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [paramIntValidator('animeId')];
    }
}

export const banAnimeReq = new BanAnimeRequest().send();
