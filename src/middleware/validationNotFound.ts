import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
export function validationNotFound(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(404).json({ errors: result.array() });
    next()
}