import { Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { RequestWithBot } from '@/ts/index';
import { RequestStatuses } from '@enums';
import isBot from '@/helper/isBot';
import prisma from '@/db';
import { baseMsg, tokenMsg } from '@/ts/messages';

export async function auth(req: RequestWithBot, res: Response, next: NextFunction) {
    const token = req.get('authorization');
    if (!token)
        return res.status(RequestStatuses.Unauthorized).json({
            message: baseMsg.notProvided
        });
    const result = token.split(' ')[1];
    jwt.verify(result, process.env.TOKEN_SECRET!, async function (err, decoded) {
        if (<any>err instanceof jwt.TokenExpiredError) {
            return res.status(RequestStatuses.Unauthorized).json({ message: tokenMsg.expired });
        }
        if (err) {
            return res.status(RequestStatuses.Unauthorized).json({
                message: tokenMsg.unauthorized
            });
        }
        req.auth = <any>decoded;
        if (!req.auth || !req.auth.token)
            return res.status(RequestStatuses.Unauthorized).json({
                message: tokenMsg.unauthorized
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
                message: tokenMsg.unauthorized
            });
        }

        if (req.auth.bot && (await isBot(req.auth.id))) {
            const userId = Number(req.query.userId);
            if (!isNaN(userId) && userId !== undefined && userId % 1 === 0) {
                req.auth.id = userId;
            }
            delete req.query.userId;
        }

        delete req.auth.bot;
        next();
    });
}
