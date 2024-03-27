import { body, ValidationChain } from "express-validator";
import { BaseValidator } from "./BaseValidator";

/**
 * Base period validator
 * @param fieldName Parameter name
 * @param typeParams Express [isArray()](https://express-validator.github.io/docs/api/validation-chain/#isarray) options object. By default limits array length to 50 elements.
 * @param message Error message for validation exceptions. By default `message: string = "validation_failed"`
 * @returns base date validation chain
 */
const bodyDateValidator = ({
    fieldName,
    typeParams,
    message
}: BaseValidator): ValidationChain => {
    return body(`${fieldName}.*`).isDate(typeParams).withMessage(message)
};

/**
 * Validate required array[any] body parameter.
 * @param fieldName Parameter name
 * @param typeParams Express [isArray()](https://express-validator.github.io/docs/api/validation-chain/#isarray) options object. By default limits array length to 50 elements.
 * @param message Error message for validation exceptions. By default `message: string = "validation_failed"`
 * @returns Array of ValidationChain
 */
export const bodySoftPeriodValidator = ({
    fieldName,
    typeParams,
    message
}: BaseValidator): any[] => {
    return [
        body(fieldName)
            .optional()
            .toArray()
            .isArray({ max: 2, min: 1 })
            .bail(),
        bodyDateValidator({ fieldName, message, typeParams })
    ]
};

/**
 * Validate required array[any] body parameter.
 * @param fieldName Parameter name
 * @param typeParams Express [isArray()](https://express-validator.github.io/docs/api/validation-chain/#isarray) options object. By default limits array length to 50 elements.
 * @param message Error message for validation exceptions. By default `message: string = "validation_failed"`
 * @returns Array of ValidationChain
 */
export const bodyStrictPeriodValidator = ({
    fieldName,
    typeParams,
    message
}: BaseValidator): any[] => {
    return [
        body(fieldName)
            .optional()
            .isArray({ min: 2, max: 2 })
            .bail(),
        bodyDateValidator({ fieldName, message, typeParams })
    ]
};
