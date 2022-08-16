import { Request, Response, NextFunction } from 'express';
import * as jwt from "jsonwebtoken";
import { RequestWithAuth } from '../ts/custom';

export function auth(req: RequestWithAuth, res: Response, next: NextFunction) {
    const token = req.get("authorization");
    if (!token) return res.status(403).json({
        data: {
            message: "No token provided",
        }
    });
    const result = token.split(" ")[1];
    jwt.verify(result, process.env.tokenSecret!, function (err, decoded) {
        if (<any>err instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ "error": true, "message": 'Token expired' });
        }
        if (err) {
            return res.status(500).json({ "error": true, "message": "Failed to authenticate token" })
        }
        req.auth = <any>decoded;
        if (!req.auth) return res.status(403).json({
            data: {
                message: "Unauthorized",
            }
        });
        next();
    });
}