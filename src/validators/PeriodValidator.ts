import { body } from "express-validator";
import { validationError } from "../middleware/validationError";

const periodValidator = (fieldName: string): any[] => {
    return [body(`${fieldName}.*`).isDate(), validationError]
};

const softPeriodValidator = (fieldName: string): any[] => {
    return [body(fieldName).optional().toArray().isArray({ max: 2, min: 1 }).bail(),
    periodValidator(fieldName), validationError]
};

const strictPeriodValidator = (fieldName: string): any[] => {
    return [body(fieldName).optional().isArray({ min: 2, max: 2 }).bail(),
    periodValidator(fieldName), validationError];
};

export { softPeriodValidator, strictPeriodValidator };