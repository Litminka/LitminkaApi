import { Request, Response } from "express";
import { RequestWithAuth, ServerError, ShikimoriWhoAmI } from "../ts/index";
import { RequestStatuses } from "../ts/enums";
import ShikimoriLinkService from "../services/ShikimoriLinkService";

export default class ShikimoriController {
    static async generateLink(req: RequestWithAuth, res: Response): Promise<Object> {
        const { id }: { id: number } = req.auth!;
        const link = await ShikimoriLinkService.generateLinkById(id);
        return res.status(RequestStatuses.OK).json({
            link: `${process.env.shikimori_url}/oauth/authorize?client_id=${process.env.shikimori_client_id}&redirect_uri=${link}&response_type=code&scope=user_rates`
        });
    }

    static async link(req: Request, res: Response): Promise<Object> {
        const { token, code } = req.query;
        await ShikimoriLinkService.link(token, code);
        return res.status(RequestStatuses.OK).json({
            message: "Account linked!"
        })
    }

    static async unlink(req: RequestWithAuth, res: Response) {
        const { id } = req.auth!;
        await ShikimoriLinkService.unlinkById(id)
        return res.status(RequestStatuses.OK).json({
            message: "Account unlinked",
            link: `${process.env.shikimori_url}/oauth/applications/${process.env.shikimori_app_id}`,
        })
    }

    static async getProfile(req: RequestWithAuth, res: Response): Promise<Object> {
        const { id } = req.auth!;
        const result = await ShikimoriLinkService.getProfile(id);
        return res.status(RequestStatuses.OK).json(result);
    }
}