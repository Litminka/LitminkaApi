import UnauthorizedError from "../../errors/clienterrors/UnauthorizedError";
import ShikimoriApiService from "./ShikimoriApiService";
import { RequestStatuses } from "../../ts/enums";
import InternalServerError from "../../errors/servererrors/InternalServerError";
import { ShikimoriWhoAmI } from "../../ts";
import UnprocessableContentError from "../../errors/clienterrors/UnprocessableContentError";
import crypto from "crypto";
import prisma from "../../db";

export default class ShikimoriLinkService {
    public static async link(token: any, code: any) {
        if (typeof token !== "string" || typeof code !== "string") throw new UnauthorizedError("Query param token must be string")
        try {
            await prisma.shikimoriLinkToken.updateWithCode(token, code);
        } catch (error) {
            throw new UnauthorizedError("Query param token must be string")
        }
        const user = await prisma.user.findUserByShikimoriLinkToken(token);
        const shikimoriapi = new ShikimoriApiService(user);
        const profile = await shikimoriapi.getProfile();
        if (!profile) throw new UnauthorizedError("User does not have shikimori integration")

        if (profile.reqStatus === RequestStatuses.InternalServerError) throw new InternalServerError();

        const integrated = await prisma.integration.findByShikimoriId((<ShikimoriWhoAmI>profile).id)
        // fix if user integrated another account
        if (integrated) {
            await prisma.integration.clear(user.id);
            throw new UnprocessableContentError("Account already linked");
            // FIXME: need to add relink
        }
        await prisma.integration.updateUserShikimoriId(user.id, (<ShikimoriWhoAmI>profile).id);
        await prisma.shikimoriLinkToken.removeToken(token);
    }

    public static async unlinkById(id: number) {
        await prisma.user.findUserByIdWithIntegration(id);
        await prisma.user.removeIntegrationById(id);
    }

    public static async getProfile(id: number) {
        const user = await prisma.user.findUserByIdWithIntegration(id);
        const shikimori = new ShikimoriApiService(user);
        const profile = await shikimori.getProfile();
        if (!profile) throw new UnauthorizedError("User does not have shikimori integration");
        if (profile.reqStatus === RequestStatuses.InternalServerError) throw new InternalServerError();
        return profile;
    }

    public static async generateLinkById(id: number) {
        const token: string = crypto.randomBytes(24).toString('hex');
        await prisma.shikimoriLinkToken.createShikimoriLinkTokenByUserId(token, id)
        return `${process.env.APP_URL}/shikimori/link?token=${token}`;
    }
}