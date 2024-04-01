import { RequestAuthTypes, RequestStatuses } from "@/ts/enums";
import { NextFunction, Response } from "express";
import { validatorError } from "@/middleware/validatorError";
import { auth } from "@/middleware/auth";
import { optionalAuth } from "@/middleware/optionalAuth";
import { RequestWithAuth, RequestWithUserPermissions } from "@/ts";
import { checkExact } from "express-validator";
import { validatorData } from "@/middleware/validatorData";
export default class Request {
    protected authType: RequestAuthTypes;

    /**
     * define rule set
     */
    protected rulesArr: any[];

    /**
     * define permissons for this request
     */
    protected permissions: string[];

    constructor() {
        this.authType = RequestAuthTypes.None;
        this.permissions = []
        this.rulesArr = []
    }

    /**
     * append ValidationChain to class context
     */
    protected rulesExtend(): void {
        this.rulesArr.push([])
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
            return next();
        }
        const user = await this.auth(id);

        if (typeof user === "undefined" || !user) {
            return res.status(RequestStatuses.Forbidden).json({ message: "Unauthorized" });
        }

        req.auth!.user = user;
        next();
    }

    private getAuthMethod() {
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

    private checkPermissions(req: RequestWithUserPermissions, res: Response, next: NextFunction) {
        if (this.permissions.length < 1) return next();

        if (req.auth.user.role === undefined || req.auth.user.role.permissions === undefined) {
            return res.status(RequestStatuses.Forbidden).json({ message: "no_permissions" })
        }

        const permissionNames = req.auth.user.role.permissions.map(perm => perm.name);

        const hasPermissions = this.permissions.every(permission => permissionNames.includes(permission));

        if (hasPermissions) {
            return next();
        }

        return res.status(RequestStatuses.Forbidden).json({ message: "no_permissions" })
    }

    /**
     * return final set of middlewares
     */
    public send() {
        this.rulesExtend();
        return [
            ...this.getAuthMethod(),
            this.checkPermissions.bind(this),
            ...(this.rulesArr.flat()),
            checkExact([], { message: 'Additional fields are not allowed' }),
            validatorError,
            validatorData
        ]
    }
}