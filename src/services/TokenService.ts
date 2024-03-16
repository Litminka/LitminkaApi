import ForbiddenError from "@errors/clienterrors/ForbiddenError";
import * as jwt from "jsonwebtoken";
import UnauthorizedError from "@errors/clienterrors/UnauthorizedError";
import InternalServerError from "@errors/servererrors/InternalServerError";

export default class TokenService {

    public static refreshToken(token?: string) {
        if (!token) throw new ForbiddenError("No token provided")
        const result = token.split(" ")[1];
        let resToken;
        jwt.verify(result, process.env.REFRESH_TOKEN_SECRET!, function (err, decoded) {
            if (<any>err instanceof jwt.TokenExpiredError) throw new UnauthorizedError("Token expired");
            if (err) throw new InternalServerError("Failed to authenticate token");
            const auth = <any>decoded;
            if (!auth) throw new InternalServerError("Failed to authenticate token");
            resToken = jwt.sign({ id: auth.id }, process.env.TOKEN_SECRET!, { expiresIn: process.env.TOKEN_LIFE })

            //TODO: Add check for session in db
        });
        return resToken;
    }
}