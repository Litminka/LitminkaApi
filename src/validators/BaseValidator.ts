import { ValidationChain, body } from "express-validator";
import { validationError } from "../middleware/validationError";

const validateId = (fieldName: string): ValidationChain => {
    return body(fieldName).isInt().notEmpty();
};

const validateArrayId = (fieldName: string): any[] => {
    return [body(fieldName).toArray().isArray({ min: 1 }), body(`${fieldName}.*`).isInt(), validationError]
};

const validateBool = (fieldName: string): any[] => {
    return [body(fieldName).isBoolean(), validationError];
};

export { validateId, validateArrayId, validateBool };