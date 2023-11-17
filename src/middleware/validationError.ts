import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
export function validationError(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(422).json({ errors: result.array() });
    next()
}