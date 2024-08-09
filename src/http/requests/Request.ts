import { Permissions, RequestAuthTypes, RequestStatuses } from '@enums';
import { NextFunction, Response } from 'express';
import { checkExact, ValidationChain } from 'express-validator';
import hasPermissions from '@/helper/hasPermission';
import { validatorError } from '@/middleware/validatorError';
import { auth } from '@/middleware/auth';
import { optionalAuth } from '@/middleware/optionalAuth';
import { validatorData } from '@/middleware/validatorData';
import OptionalRequest from '@requests/OptionalRequest';
import AuthRequest from '@requests/AuthRequest';
import { Prisma } from '@prisma/client';
import { SortAnimeFieldsType } from '@/ts/sorts';

interface BaseReq<T extends Request> {
    auth: {
        id?: number;
        token?: string;
    };
    user?: Prisma.PromiseReturnType<T['getUser']>;
}

export default class Request implements BaseReq<Request> {
    protected authType: RequestAuthTypes;
    protected permissions: Permissions[];
    // Define request interface
    public sortFields = ['name'] as const satisfies SortAnimeFieldsType[];
    public auth!: {
        id?: number;
        token?: string;
    };
    public user?: Prisma.PromiseReturnType<this['getUser']>;
    public body = {};
    public query = {};
    public params = {};

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

    public get(name: string): string {
        return String(name);
    }

    /**
     *  if authType is not None
     *  Define prisma user request for this method
     *
     *  @returns Prisma User Variant
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public async getUser(userId: number): Promise<unknown> {
        return undefined;
    }

    private async constructAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
        const { id }: { id: number } = req.auth;
        const user = await this.getUser(id);

        if (typeof user === 'undefined' || !user) {
            return res.status(RequestStatuses.Forbidden).json({ message: 'Unauthorized' });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        req.user = user as any;
        next();
    }

    private async constructOptionalAuthMiddleware(
        req: OptionalRequest,
        res: Response,
        next: NextFunction
    ) {
        const id = req.auth?.id;
        if (typeof id === 'undefined') {
            return next();
        }
        const user = await this.getUser(id);

        if (typeof user === 'undefined' || !user) {
            return res.status(RequestStatuses.Forbidden).json({ message: 'Unauthorized' });
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        req.user = user as any;
        next();
    }

    private getAuthMethod() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    private checkPermissions(req: AuthRequest, res: Response, next: NextFunction) {
        const hasPermission = hasPermissions(this.permissions, req.user);

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

export const baseReq = new Request().send();
