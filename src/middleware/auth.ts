import { Response, NextFunction } from 'express';
import * as jwt from "jsonwebtoken";
import { RequestWithBot } from '@/ts/index';
import { RequestStatuses } from '@/ts/enums';
import isBot from '@/helper/isBot';

export async function auth(req: RequestWithBot, res: Response, next: NextFunction) {
    const token = req.get("authorization");
    if (!token) return res.status(RequestStatuses.Forbidden).json({
        data: {
            message: "No token provided",
        }
    });
    const result = token.split(" ")[1];
    jwt.verify(result, process.env.TOKEN_SECRET!, async function (err, decoded) {
        if (<any>err instanceof jwt.TokenExpiredError) {
            return res.status(RequestStatuses.Unauthorized).json({ "error": true, "message": 'Token expired' });
        }
        if (err) {
            return res.status(RequestStatuses.InternalServerError).json({ "error": true, "message": "Failed to authenticate token" })
        }
        req.auth = <any>decoded;
        if (!req.auth) return res.status(RequestStatuses.Forbidden).json({
            data: {
                message: "Unauthorized",
            }
        });

        if (req.auth.bot && await isBot(req.auth.id)) {
            console.log("i am a bot!")
            const userId = Number(req.query.userId);
            if (!isNaN(userId) && userId !== undefined && userId % 1 === 0) {
                req.auth.id = userId;
            }
            delete req.query.userId;
            console.log(`requesting as ${req.auth.id}`);
        }

        delete req.auth.bot;
        next();
    });
}