import { Request, Response } from "express";
import { RequestStatuses } from "../ts/enums";
import TokenService from "../services/TokenService";

export default class TokenController {
    
    public static refreshToken(req: Request, res: Response) {
        const token = req.get("authorization");
        const resToken = TokenService.refreshToken(token)
        return res.status(RequestStatuses.OK).json({ data: { resToken } });
    }

    // TODO: Add the ability to end sessions except current
}