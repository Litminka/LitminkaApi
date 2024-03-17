import { Response, NextFunction } from 'express';
import * as jwt from "jsonwebtoken";
import { RequestWithAuth } from '@/ts/index';
import { RequestStatuses } from '@/ts/enums';

export function optionalAuth(req: RequestWithAuth, res: Response, next: NextFunction) {
    const token = req.get("authorization");
    if (!token) return next();
    const result = token.split(" ")[1];
    jwt.verify(result, process.env.TOKEN_SECRET!, function (err, decoded) {
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
        next();
    });
}