import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { RequestWithBot } from '@/ts/index';
import { RequestStatuses } from '@enums';
import prisma from '@/db';
import { tokenMsg } from '@/ts/messages';

export async function optionalAuth(req: RequestWithBot, res: Response, next: NextFunction) {
    const token = req.get('authorization');
    if (!token) return next();
    const result = token.split(' ')[1];
    jwt.verify(result, process.env.TOKEN_SECRET!, async function (err, decoded) {
        if (<any>err instanceof jwt.TokenExpiredError) {
            return res.status(RequestStatuses.Unauthorized).json({ error: tokenMsg.expired });
        }
        if (err) {
            return res.status(RequestStatuses.Unauthorized).json({ error: tokenMsg.unauthorized });
        }
        req.auth = <any>decoded;
        if (!req.auth || !req.auth.token)
            return res.status(RequestStatuses.Unauthorized).json({
                error: tokenMsg.unauthorized
            });
        try {
            await prisma.sessionToken.findFirstOrThrow({
                where: {
                    userId: req.auth.id,
                    token: req.auth.token
                }
            });
        } catch (error) {
            return res.status(RequestStatuses.Unauthorized).json({
                error: tokenMsg.unauthorized
            });
        }

        next();
    });
}
