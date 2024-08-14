import { Response } from 'express';
import { RequestStatuses } from '@enums';
import ShikimoriLinkService from '@services/shikimori/ShikimoriLinkService';
import LinkShikimoriRequest from '@requests/shikimori/LinkShikimoriRequest';
import config from '@/config';
import IntegrationRequest from '@requests/IntegrationRequest';

export default class ShikimoriController {
    static async generateLink(req: IntegrationRequest, res: Response) {
        const user = req.user;

        const link = await ShikimoriLinkService.generateLink(user);

        return res.status(RequestStatuses.OK).json({
            body: `${config.shikimoriUrl}/oauth/authorize?client_id=${config.shikimoriClientId}&redirect_uri=${link}&response_type=code&scope=user_rates`
        });
    }

    static async link(req: LinkShikimoriRequest, res: Response) {
        const { token, code } = req.query;

        await ShikimoriLinkService.link(token, code);

        return res.status(RequestStatuses.Created).json();
    }

    static async unlink(req: IntegrationRequest, res: Response) {
        const user = req.user;

        ShikimoriLinkService.unlink(user);

        return res.status(RequestStatuses.Accepted).json({
            body: `${config.shikimoriUrl}/oauth/applications/${config.shikimoriAppId}`
        });
    }

    static async getProfile(req: IntegrationRequest, res: Response) {
        const user = req.user;

        const result = await ShikimoriLinkService.getProfile(user);

        return res.status(RequestStatuses.OK).json({ body: result });
    }
}
