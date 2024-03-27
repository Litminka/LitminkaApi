import { Response, NextFunction } from 'express';
import * as jwt from "jsonwebtoken";
import { RequestWithBot } from '@/ts/index';
import { RequestStatuses } from '@/ts/enums';
import prisma from '@/db';

export async function optionalAuth(req: RequestWithBot, res: Response, next: NextFunction) {
    const token = req.get("authorization");
    if (!token) return next();
    const result = token.split(" ")[1];
    jwt.verify(result, process.env.TOKEN_SECRET!, async function (err, decoded) {
        if (<any>err instanceof jwt.TokenExpiredError) {
            return res.status(RequestStatuses.Unauthorized).json({ "error": true, "message": 'Token expired' });
        }
        if (err) {
            return res.status(RequestStatuses.InternalServerError).json({ "error": true, "message": "Failed to authenticate token" })
        }
        req.auth = <any>decoded;
        if (!req.auth || !req.auth.token) return res.status(RequestStatuses.Forbidden).json({
            data: {
                message: "Unauthorized",
            }
        });
        try {
            await prisma.sessionToken.findFirstOrThrow({
                where: {
                    userId: req.auth.id,
                    token: req.auth.token
                }
            });
        } catch (error) {
            return res.status(RequestStatuses.Forbidden).json({
                data: {
                    message: "Unauthorized",
                }
            });
        }

        next();
    });
}