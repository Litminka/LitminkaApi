import { ValidationChain, body, param } from "express-validator";
import { validationError } from "../middleware/validationError";

const validateBodyId = (fieldName: string): ValidationChain => {
    return body(fieldName).isInt().notEmpty();
};

const validateParamId = (fieldName: string): ValidationChain => {
    return param(fieldName).isInt().notEmpty();
};

const validateArrayId = (fieldName: string): any[] => {
    return [body(fieldName).toArray().isArray({ min: 1 }), body(`${fieldName}.*`).isInt(), validationError]
};

const validateBool = (fieldName: string): any[] => {
    return [body(fieldName).isBoolean(), validationError];
};

export { validateBodyId, validateParamId, validateArrayId, validateBool };