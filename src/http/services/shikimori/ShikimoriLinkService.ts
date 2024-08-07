import ShikimoriApiService from '@services/shikimori/ShikimoriApiService';
import { UserWithIntegration } from '@/ts/user';
import { ShikimoriProfile } from '@/ts/shikimori';
import UnprocessableContentError from '@/errors/clienterrors/UnprocessableContentError';
import crypto from 'crypto';
import prisma from '@/db';
import BadRequestError from '@/errors/clienterrors/BadRequestError';
import NotFoundError from '@/errors/clienterrors/NotFoundError';
import config from '@/config';

export default class ShikimoriLinkService {
    public static async link(token: string, code: string) {
        try {
            await prisma.shikimoriLinkToken.updateWithCode(token, code);
        } catch (error) {
            throw new NotFoundError('Query param token must be string');
        }
        const user = await prisma.user.findUserByShikimoriLinkToken(token);
        if (user.integration?.shikimoriId)
            throw new BadRequestError('User already has shikimori integration');

        const shikimoriapi = new ShikimoriApiService(user);
        const profile = await shikimoriapi.getProfile();
        if (!profile) throw new BadRequestError('User does not have shikimori integration');

        const integrated = await prisma.integration.findByShikimoriId(
            (<ShikimoriProfile>profile).id
        );
        // fix if user integrated this shikimori account on another user account
        if (integrated) {
            await prisma.integration.clearShikimoriIntegration(user.id);
            throw new UnprocessableContentError('Account already linked');
        }
        await prisma.integration.updateUserShikimoriId(user.id, (<ShikimoriProfile>profile).id);
        await prisma.shikimoriLinkToken.removeToken(token);
    }

    public static async unlink(user: UserWithIntegration) {
        await prisma.user.removeIntegrationById(user.id);
    }

    public static async getProfile(user: UserWithIntegration) {
        const shikimori = new ShikimoriApiService(user);
        const profile = await shikimori.getProfile();
        if (!profile) throw new BadRequestError('User does not have shikimori integration');
        return profile;
    }

    public static async generateLink(user: UserWithIntegration) {
        if (user.integration?.shikimoriId)
            throw new BadRequestError('User already has shikimori integration');

        const token: string = crypto.randomBytes(24).toString('hex');
        await prisma.shikimoriLinkToken.createShikimoriLinkTokenByUserId(token, user.id);
        return `${config.appUrl}/shikimori/link?token=${token}`;
    }
}
