import { body, oneOf, param } from "express-validator";
import { isDate } from "util/types";
import { validationError } from "../middleware/validationError";


const PeriodValidator = (): any[] => {
    // return [oneOf(
    //     [
    //         body('created_at').isArray({ max: 2, min: 1 }).bail().notEmpty().bail(),
    //         body('created_at.*').isDate()
    //     ],
    //     [
    //         body('created_at').isString().toArray().notEmpty().bail(),
    //         body('created_at.*').isDate()
    //     ]
    // ), validationError]
    return [body('created_at').optional().toArray().isArray({ max: 2, min: 1 }).bail().notEmpty(),
    body('created_at.*').isDate(), validationError]
}

export { PeriodValidator };