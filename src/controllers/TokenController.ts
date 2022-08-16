import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
export default class TokenController {
    public static refreshToken(req: Request, res: Response) {
        const token = req.get("authorization");
        if (!token) return res.status(403).json({
            data: {
                message: "No token provided",
            }
        });
        const result = token.split(" ")[1];
        jwt.verify(result, process.env.tokenRefreshSecret!, function (err, decoded) {
            if (<any>err instanceof jwt.TokenExpiredError) {
                return res.status(401).json({ "error": true, "message": 'Token expired' });
            }
            if (err) {
                return res.status(500).json({ "error": true, "message": "Failed to authenticate token" })
            }
            const auth = <any>decoded;
            if (!auth) return res.status(500).json({ "error": true, "message": "Failed to authenticate token" });
            const token = jwt.sign({ id: auth.id }, process.env.tokenSecret!, { expiresIn: process.env.tokenLife })
            return res.status(200).json({ data: { token } });
            //TODO: Add check for session in db
        });
    }

    // TODO: Add the ability to end sessions except current
}