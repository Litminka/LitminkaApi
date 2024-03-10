import { body } from "express-validator";
import { validationError } from "../middleware/validationError";

const periodValidator = (): any[] => {
    return [body('createdAt').optional().toArray().isArray({ max: 2, min: 1 }).bail().notEmpty(),
    body('createdAt.*').isDate(), validationError]
}

export { periodValidator };