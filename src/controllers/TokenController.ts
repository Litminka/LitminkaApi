import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { RequestStatuses } from "../ts/enums";
export default class TokenController {
    public static refreshToken(req: Request, res: Response) {
        const token = req.get("authorization");
        if (!token) return res.status(RequestStatuses.Forbidden).json({
            data: {
                message: "No token provided",
            }
        });
        const result = token.split(" ")[1];
        jwt.verify(result, process.env.tokenRefreshSecret!, function (err, decoded) {
            if (<any>err instanceof jwt.TokenExpiredError) {
                return res.status(RequestStatuses.Unauthorized).json({ "error": true, "message": 'Token expired' });
            }
            if (err) {
                return res.status(RequestStatuses.InternalServerError).json({ "error": true, "message": "Failed to authenticate token" })
            }
            const auth = <any>decoded;
            if (!auth) return res.status(RequestStatuses.InternalServerError).json({ "error": true, "message": "Failed to authenticate token" });
            const token = jwt.sign({ id: auth.id }, process.env.tokenSecret!, { expiresIn: process.env.tokenLife })
            return res.status(RequestStatuses.OK).json({ data: { token } });
            //TODO: Add check for session in db
        });
    }

    // TODO: Add the ability to end sessions except current
}