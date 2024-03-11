import { RequestAuthTypes, RequestStatuses } from "../ts/enums";
import { NextFunction, Response } from "express";
import { validationError } from "../middleware/validationError";
import { auth } from "../middleware/auth";
import { optionalAuth } from "../middleware/optionalAuth";
import { RequestWithAuth } from "../ts";
import { checkExact } from "express-validator";

export default class Request {

    protected authType: RequestAuthTypes;

    constructor() {
        this.authType = RequestAuthTypes.None;
    }
    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        return []
    }

    /**
     *  if authType is not None 
     *  Define prisma user request for this method
     * 
     *  @returns Prisma User Variant
     */
    protected async auth(userId: number): Promise<any> {

    }

    private async constructAuthMiddleware(req: RequestWithAuth, res: Response, next: NextFunction) {
        const { id }: { id: number } = req.auth!;
        const user = await this.auth(id);

        if (typeof user === "undefined" || !user) {
            return res.status(RequestStatuses.Forbidden).json({ message: "Unauthorized" });
        }

        req.auth!.user = user;
        next();
    }

    private async constructOptionalAuthMiddleware(req: RequestWithAuth, res: Response, next: NextFunction) {
        const { id }: { id: number } = req.auth!;
        if (typeof id === "undefined") {
            next();
        }
        const user = await this.auth(id);

        if (typeof user === "undefined" || !user) {
            return res.status(RequestStatuses.Forbidden).json({ message: "Unauthorized" });
        }

        req.auth!.user = user;
        next();
    }

    protected getAuthMethod() {
        const middleware: any = [];
        if (this.authType === RequestAuthTypes.Auth) {
            middleware.push(auth)
            middleware.push(this.constructAuthMiddleware.bind(this)) // Yea yea, this is a mistake... Too bad!
        }
        if (this.authType === RequestAuthTypes.Optional) {
            middleware.push(optionalAuth);
            middleware.push(this.constructOptionalAuthMiddleware.bind(this)) // Yea yea, this is a mistake... Too bad!
        }

        return middleware
    }

    /**
     * return final set of middlewares
     */
    public send() {
        return [
            ...this.getAuthMethod(),
            ...this.rules(),
            checkExact([], { message: 'Additional fields are not allowed' }),
            validationError
        ]
    }
}