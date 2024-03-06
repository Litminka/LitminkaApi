import { NextFunction, Response } from "express";
import BaseError from "../errors/BaseError";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const isProduction = process.env.NODE_ENV === "production";

export function wrap(method: Function) {
    return async function (req: any, res: any, next: NextFunction) {
        try {
            await method(req, res, next);
        } catch (err: any) {
            
            if (err instanceof BaseError) return renderError(res, err, err.status);

            if (err instanceof PrismaClientKnownRequestError) return renderError(res, err, 404);

            console.error(err);
            return renderError(res, err, 500);
        }
    };
};

function renderError(res: Response, err: Error, status: number) {
    return res.status(status).json({
        error: err.message,
        stack: !isProduction ? err.stack : undefined
    })
}