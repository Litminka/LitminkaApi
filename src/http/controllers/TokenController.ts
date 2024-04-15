import { Request, Response } from 'express';
import { RequestStatuses } from '@enums';
import TokenService from '@services/TokenService';
import { AuthReq } from '@requests/AuthRequest';
import { EndSessionReq } from '@requests/session/EndSessionRequest';

export default class TokenController {
    public static async refreshToken(req: Request, res: Response) {
        const token = req.get('authorization');

        const tokens = await TokenService.refreshToken(token);

        return res.status(RequestStatuses.OK).json({ body: tokens });
    }

    public static async getTokens(req: AuthReq, res: Response) {
        const user = req.auth.user;

        const tokens = await TokenService.getTokens(user.id);

        const result = [];

        for (const { id, token } of tokens) {
            result.push({
                id,
                token,
                isCurrent: req.auth.token === token
            });
        }

        return res.status(RequestStatuses.OK).json({ body: result });
    }

    public static async deleteTokens(req: EndSessionReq, res: Response) {
        const user = req.auth.user;
        const token = req.auth.token;
        const sessions = req.body.sessions;

        await TokenService.deleteTokens(user.id, token, sessions);

        return res.status(RequestStatuses.Accepted);
    }
}
