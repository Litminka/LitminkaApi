import { body } from "express-validator";
import { validationError } from "../middleware/validationError";

const periodValidator = (): any[] => {
    return [body('created_at').optional().toArray().isArray({ max: 2, min: 1 }).bail().notEmpty(),
    body('created_at.*').isDate(), validationError]
}

export { periodValidator };