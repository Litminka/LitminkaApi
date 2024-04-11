import { Permissions, RequestAuthTypes, RequestStatuses } from '@/ts/enums';
import { NextFunction, Response } from 'express';
import { checkExact, ValidationChain } from 'express-validator';
import hasPermissions from '@/helper/hasPermission';
import { validatorError } from '@/middleware/validatorError';
import { auth } from '@/middleware/auth';
import { optionalAuth } from '@/middleware/optionalAuth';
import { validatorData } from '@/middleware/validatorData';
import { WithPermissionsReq } from '@requests/WithPermissionsRequest';
import { OptionalReq } from '@requests/OptionalRequest';
import { AuthReq } from '@requests/AuthRequest';

export default class Request {
    protected authType: RequestAuthTypes;

    /**
     * define permissons for this request
     */
    protected permissions: Permissions[];

    constructor() {
        this.authType = RequestAuthTypes.None;
        this.permissions = [];
    }

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [];
    }

    /**
     *  if authType is not None
     *  Define prisma user request for this method
     *
     *  @returns Prisma User Variant
     */
    protected async auth(userId: number): Promise<any> {}

    private async constructAuthMiddleware(req: AuthReq, res: Response, next: NextFunction) {
        const { id }: { id: number } = req.auth!;
        const user = await this.auth(id);

        if (typeof user === 'undefined' || !user) {
            return res.status(RequestStatuses.Forbidden).json({ message: 'Unauthorized' });
        }

        req.auth!.user = user;
        next();
    }

    private async constructOptionalAuthMiddleware(
        req: OptionalReq,
        res: Response,
        next: NextFunction
    ) {
        const id = req.auth?.id;
        if (typeof id === 'undefined') {
            return next();
        }
        const user = await this.auth(id);

        if (typeof user === 'undefined' || !user) {
            return res.status(RequestStatuses.Forbidden).json({ message: 'Unauthorized' });
        }

        req.auth!.user = user;
        next();
    }

    private getAuthMethod() {
        const middleware: any = [];
        if (this.authType === RequestAuthTypes.Auth) {
            middleware.push(auth);
            middleware.push(this.constructAuthMiddleware.bind(this)); // Yea yea, this is a mistake... Too bad!
        }
        if (this.authType === RequestAuthTypes.Optional) {
            middleware.push(optionalAuth);
            middleware.push(this.constructOptionalAuthMiddleware.bind(this)); // Yea yea, this is a mistake... Too bad!
        }

        return middleware;
    }

    private checkPermissions(req: WithPermissionsReq, res: Response, next: NextFunction) {
        const hasPermission = hasPermissions(this.permissions, req.auth?.user);

        if (hasPermission) return next();
        return res.status(RequestStatuses.Forbidden).json({ message: 'no_permissions' });
    }

    /**
     * return final set of middlewares
     */
    public send() {
        return [
            ...this.getAuthMethod(),
            this.checkPermissions.bind(this),
            ...this.rules().flat(),
            checkExact([], { message: 'Additional fields are not allowed' }),
            validatorError,
            validatorData
        ];
    }
}
