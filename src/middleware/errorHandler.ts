import { NextFunction, Response, Request } from 'express';
import BaseError from '@/errors/BaseError';
import { RequestStatuses } from '@enums';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { logger } from '@/loggerConf';
import config from '@/config';

const isProduction = config.runEnvironment === 'production';

// eslint-disable-next-line @typescript-eslint/ban-types
export function wrap(method: Function) {
    return async function (req: any, res: any, next: NextFunction) {
        try {
            await method(req, res, next);
        } catch (err: any) {
            if (err instanceof BaseError) return renderError(res, err, err.status);
            if (err instanceof PrismaClientKnownRequestError)
                return renderError(res, err, RequestStatuses.NotFound);
            logger.error(err);
            if (!isProduction) return renderError(res, err, RequestStatuses.InternalServerError);

            return renderError(res, new Error('server_error'), RequestStatuses.InternalServerError);
        }
    };
}

// eslint-disable-next-line @typescript-eslint/ban-types
export default function handleControllerErrors(target: Function) {
    function getMethodDescriptor(propertyName: string) {
        // eslint-disable-next-line no-prototype-builtins
        if (Object.prototype.hasOwnProperty(propertyName)) {
            const descriptor = Object.getOwnPropertyDescriptor(target.prototype, propertyName);
            if (typeof descriptor !== 'undefined') return descriptor;
        }
        return {
            configurable: true,
            enumerable: true,
            writable: true,
            value: target.prototype[propertyName]
        };
    }

    for (const propertyName in target.prototype) {
        const propertyValue = target.prototype[propertyName];
        const isMethod = propertyValue instanceof Function;
        if (!isMethod) continue;

        const descriptor = getMethodDescriptor(propertyName);
        const originalMethod = descriptor.value;
        descriptor.value = function (req: Request, res: Response) {
            try {
                return originalMethod.apply(this, res, req);
            } catch (err: any) {
                if (err instanceof BaseError) {
                    return renderError(res, err, err.status);
                }
                if (err instanceof PrismaClientKnownRequestError) {
                    return renderError(res, err, RequestStatuses.NotFound);
                }

                logger.error(err);

                if (!isProduction) {
                    return renderError(res, err, RequestStatuses.InternalServerError);
                }

                return renderError(
                    res,
                    new Error('server_error'),
                    RequestStatuses.InternalServerError
                );
            }
        };
        Object.defineProperty(target.prototype, propertyName, descriptor);
    }
}

function renderError(res: Response, err: Error, status: number) {
    return res.status(status).json({
        error: err.message,
        stack: !isProduction ? err.stack : undefined
    });
}
