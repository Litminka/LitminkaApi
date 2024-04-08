import { Request, Response, NextFunction } from 'express';
import { matchedData } from 'express-validator';
export function validatorData(req: Request, res: Response, next: NextFunction) {
    req.body = matchedData(req, { locations: ['body'] });
    req.params = matchedData(req, { locations: ['params'] });
    req.query = matchedData(req, { locations: ["query"] });
    next();
}