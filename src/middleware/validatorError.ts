import { Request, Response, NextFunction } from 'express';
import { ValidationError, validationResult } from 'express-validator';
import { RequestStatuses } from '@/ts/enums';
import { AdditionalValidationError } from '@/ts/index'

export function validatorError(req: Request, res: Response, next: NextFunction) {
    const customValidationResult = validationResult.withDefaults({
        formatter: (error: any) => {
            let customError: AdditionalValidationError = {
                additional: {},
                location: error.location,
                path: error.path,
                value: error.value,
                msg: error.msg,
                type: error.type
            }
            if (typeof error.msg === 'object') {
                customError.additional = ((obj: ValidationError) => {
                    let result: ValidationError = structuredClone(obj.msg)
                    delete result.msg
                    return result
                })(error)
                customError.msg = error.msg.msg
            }
            return customError;
        }
    });
    // const result = validationResult(req);
    const result = customValidationResult(req);
    if (!result.isEmpty()) return res.status(RequestStatuses.UnprocessableContent).json({ errors: result.array() });
    next()
}