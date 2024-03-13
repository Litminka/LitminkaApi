import { Response } from "express";
import { RequestStatuses } from "../ts/enums";
import ShikimoriLinkService from "../services/ShikimoriLinkService";
import { RequestUserWithIntegration, RequestWithTokenAndCode } from "../ts";

export default class ShikimoriController {
    static async generateLink(req: RequestUserWithIntegration, res: Response): Promise<Object> {
        const user = req.auth.user;
      
        const link = await ShikimoriLinkService.generateLink(user);
      
        return res.status(RequestStatuses.OK).json({
            link: `${process.env.SHIKIMORI_URL}/oauth/authorize?client_id=${process.env.SHIKIMORI_CLIENT_ID}&redirect_uri=${link}&response_type=code&scope=user_rates`
        });
    }

    static async link(req: RequestWithTokenAndCode, res: Response): Promise<Object> {
        const { token, code } = req.query;
      
        await ShikimoriLinkService.link(token, code);
      
        return res.status(RequestStatuses.OK).json({
            message: "Account linked!"
        })
    }

    static async unlink(req: RequestUserWithIntegration, res: Response) {
        const user = req.auth.user;
      
        await ShikimoriLinkService.unlink(user)
      
        return res.status(RequestStatuses.OK).json({
            message: "Account unlinked",
            link: `${process.env.SHIKIMORI_URL}/oauth/applications/${process.env.SHIKIMORI_APP_ID}`,
        })
    }

    static async getProfile(req: RequestUserWithIntegration, res: Response): Promise<Object> {
        const user = req.auth.user;

        const result = await ShikimoriLinkService.getProfile(user);

        return res.status(RequestStatuses.OK).json(result);
    }
}