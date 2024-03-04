import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestStatuses } from '../ts/enums';
export function validationError(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(RequestStatuses.UnprocessableContent).json({ errors: result.array() });
    next()
}