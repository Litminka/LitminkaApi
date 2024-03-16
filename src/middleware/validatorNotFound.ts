import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { RequestStatuses } from '@/ts/enums';
export function validatorNotFound(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(RequestStatuses.NotFound).json({ errors: result.array() });
    next()
}