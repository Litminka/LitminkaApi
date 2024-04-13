import { NextFunction, Response } from 'express';
import BaseError from '@/errors/BaseError';
import { RequestStatuses } from '@/ts/enums';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { logger } from '@/loggerConf';

const isProduction = process.env.NODE_ENV === 'production';

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

function renderError(res: Response, err: Error, status: number) {
    return res.status(status).json({
        error: err.message,
        stack: !isProduction ? err.stack : undefined
    });
}
