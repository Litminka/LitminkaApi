import { baseMsg } from "@/ts/messages";
import { body, ValidationChain } from "express-validator";
import { BaseValidator } from "./BaseValidator";

/**
 * Validate required array[any] body parameter.
 * @param fieldName Parameter name
 * @param typeParams Express [isArray()](https://express-validator.github.io/docs/api/validation-chain/#isarray) options object. By default limits array length to 50 elements.
 * @param message Error message for validation exceptions. By default `message: string = "validation_failed"`
 */
export const bodyArrayValidator = ({
    fieldName,
    typeParams = { min: 0, max: 50 },
    message = baseMsg.validationFailed
}: BaseValidator): ValidationChain => {
    return body(fieldName)
        .toArray()
        .isArray(typeParams)
        .withMessage(message)
};

/**
 * Validate required `string` body parameter.
 * @param fieldName Parameter name
 * @param typeParams Express [isLength()](https://express-validator.github.io/docs/api/validation-chain/#islength) options object. By default limited by 32 characters length.
 * @param message Error message for validation exceptions.
 */
export const bodyStringValidator = ({
    fieldName,
    typeParams = { min: 0, max: 32 },
    message = baseMsg.validationFailed
}: BaseValidator): ValidationChain => {
    return body(fieldName, baseMsg.intValidationFailed)
        .isString()
        .isLength(typeParams)
        .withMessage(message);
};

/**
 * Validate required `number` body parameter.
 * @param fieldName Parameter name
 * @param typeParams Express [isInt()](https://express-validator.github.io/docs/api/validation-chain/#isint) options object. By default limited to int32 positive numbers.
 * @param message Error message for validation exceptions.
 */
export const bodyIdValidator = ({
    fieldName,
    typeParams = { min: 1, max: 2147483647 },
    message = baseMsg.validationFailed
}: BaseValidator): ValidationChain => {
    return body(fieldName, baseMsg.intValidationFailed)
        .isInt(typeParams)
        .toInt()
        .withMessage(message);
};

/**
 * Validate required boolean body parameter
 * @param fieldName Parameter name
 * @param typeParams Express [isBoolead()](https://express-validator.github.io/docs/api/validation-chain/#isboolean) options object. 
 * @param message Error message for validation exceptions. 
 */
export const bodyBoolValidator = ({
    fieldName,
    typeParams,
    message = baseMsg.validationFailed
}: BaseValidator): ValidationChain => {
    return body(fieldName, baseMsg.boolValidationFailed)
        .isBoolean(typeParams)
        .withMessage(message)
};
