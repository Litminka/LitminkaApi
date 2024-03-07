import ForbiddenError from "../errors/clienterrors/ForbiddenError";
import UnauthorizedError from "../errors/clienterrors/UnauthorizedError";
import ShikimoriLinkToken from "../models/ShikimoriLinkToken";
import User from "../models/User";
import ShikimoriApiService from "./ShikimoriApiService";
import { RequestStatuses } from "../ts/enums";
import InternalServerError from "../errors/servererrors/InternalServerError";
import Integration from "../models/Integration";
import { ShikimoriWhoAmI } from "../ts";
import UnprocessableContentError from "../errors/clienterrors/UnprocessableContentError";

export default class ShikimoriLinkService{
    public static async link(token: any, code: any){
        if (typeof token !== "string" || typeof code !== "string") throw new UnauthorizedError("Query param token must be string") 
        try {
            await ShikimoriLinkToken.updateWithCode(token, code);
        } catch (error) {
            throw new UnauthorizedError("Query param token must be string") 
        }
        const user = await User.findUserByShikimoriLinkToken(token);
        const shikimoriapi = new ShikimoriApiService(user);
        const profile = await shikimoriapi.getProfile();
        if (!profile) throw new UnauthorizedError("User does not have shikimori integration")
        
        if (profile.reqStatus === RequestStatuses.InternalServerError) throw new InternalServerError();

        const integrated = await Integration.findByShikimoriId((<ShikimoriWhoAmI>profile).id)
        // fix if user integrated another account
        if (integrated) {
            await Integration.clear(user.id)
            throw new UnprocessableContentError("Account already linked")
        }
        await Integration.updateUserShikimoriId(user.id, (<ShikimoriWhoAmI>profile).id);
        await ShikimoriLinkToken.removeToken(token);
    }
}