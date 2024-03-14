import UnauthorizedError from "../../errors/clienterrors/UnauthorizedError";
import ShikimoriApiService from "./ShikimoriApiService";
import { RequestStatuses } from "../../ts/enums";
import InternalServerError from "../../errors/servererrors/InternalServerError";
import { ShikimoriWhoAmI, UserWithIntegration } from "../../ts";
import UnprocessableContentError from "../../errors/clienterrors/UnprocessableContentError";
import crypto from "crypto";
import prisma from "../../db";
import ForbiddenError from "../../errors/clienterrors/ForbiddenError";
import BadRequestError from "../../errors/clienterrors/BadRequestError";

export default class ShikimoriLinkService {
    public static async link(token: string, code: string) {
        try {
            await prisma.shikimoriLinkToken.updateWithCode(token, code);
        } catch (error) {
            throw new UnauthorizedError("Query param token must be string")
        }
        const user = await prisma.user.findUserByShikimoriLinkToken(token);
        if (user.integration?.shikimoriId) throw new BadRequestError("User already has shikimori integration");
      
        const shikimoriapi = new ShikimoriApiService(user);
        const profile = await shikimoriapi.getProfile();
        if (!profile) throw new UnauthorizedError("User does not have shikimori integration")

        if (profile.reqStatus === RequestStatuses.InternalServerError) throw new InternalServerError();

        const integrated = await prisma.integration.findByShikimoriId((<ShikimoriWhoAmI>profile).id)
        // fix if user integrated this shikimori account on another user account
        if (integrated) {
            await prisma.integration.clear(user.id);
            throw new UnprocessableContentError("Account already linked");
            // FIXME: need to add relink
        }
        await prisma.integration.updateUserShikimoriId(user.id, (<ShikimoriWhoAmI>profile).id);
        await prisma.shikimoriLinkToken.removeToken(token);
    }

    public static async unlink(user: UserWithIntegration) {
        await prisma.user.removeIntegrationById(user.id);
    }

    public static async getProfile(user: UserWithIntegration) {
        const shikimori = new ShikimoriApiService(user);
        const profile = await shikimori.getProfile();
        if (!profile) throw new UnauthorizedError("User does not have shikimori integration");
        if (profile.reqStatus === RequestStatuses.InternalServerError) throw new InternalServerError();
        return profile;
    }
  
    public static async generateLink(user: UserWithIntegration) {

        if (user.integration?.shikimoriId) throw new BadRequestError("User already has shikimori integration");

        const token: string = crypto.randomBytes(24).toString('hex');
        await prisma.shikimoriLinkToken.createShikimoriLinkTokenByUserId(token, user.id)
        return `${process.env.APP_URL}/shikimori/link?token=${token}`;
    }
}