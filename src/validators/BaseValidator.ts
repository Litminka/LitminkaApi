import { ValidationChain, body, param, query } from "express-validator";
import { ValidatorErrorMessage } from "@/ts";
import { validation } from '@/ts/messages';

const base = validation.errors.base;

/**
 * Base input parameters to all base validators
 */
export interface BaseValidator {
    fieldName: string,
    message: ValidatorErrorMessage,
    typeParams?: object,
};

interface validateQueryInt extends BaseValidator {
    defValue: any
};

/**
 * 
 * @param fieldName 
 * @returns 
 */
export const paramIdValidator = (fieldName: string): ValidationChain => {
    return param(fieldName).isInt({ min: 1, max: 2147483647 }).notEmpty().toInt();
};

/**
 * Validate required array[any] body parameter.
 * @param fieldName Parameter name
 * @param typeParams Express [isArray()](https://express-validator.github.io/docs/api/validation-chain/#isarray) options object. By default limits array length to 50 elements
 * @param message Error message for validation exceptions. By default `message: string = "validation_failed"`
 * @returns
 */
export const bodyArrayValidator = ({
    fieldName,
    typeParams = { min: 0, max: 50 },
    message = base.validationFailed
}: BaseValidator): ValidationChain => {
    return body(fieldName)
        .toArray()
        .isArray(typeParams)
        .withMessage(message)
};

/**
 * Validate required `number[]` body parameter.
 * @param fieldName Parameter name
 * @param typeParams Express [isInt()](https://express-validator.github.io/docs/api/validation-chain/#isint) options object. By default limited to int32 positive numbers.
 * @param message Error message for validation exceptions.
 * @returns
 */
export const bodyIdValidator = ({
    fieldName,
    typeParams = { min: 1, max: 2147483647 },
    message = base.validationFailed
}: BaseValidator): ValidationChain => {
    return body(fieldName, base.intValidationFailed)
        .isInt(typeParams)
        .toInt()
        .withMessage(message);
};

/**
 * Validate required boolean body parameter
 * @param fieldName Parameter name
 * @param typeParams Express [isBoolead()](https://express-validator.github.io/docs/api/validation-chain/#isboolean) options object. 
 * @param message Error message for validation exceptions.
 * @returns  
 */
export const bodyBoolValidator = ({
    fieldName,
    typeParams,
    message = base.validationFailed
}: BaseValidator): ValidationChain => {
    return body(fieldName, "bool_validation_failed")
        .isBoolean(typeParams)
        .withMessage(message)
};

/**
 * Validate optional integer query parameter with default value
 * @param fieldName Parameter name
 * @param defValue Default value if parameter `undefined` or `null`
 * @param typeParams Express [isint()](https://express-validator.github.io/docs/api/validation-chain/#isint) options object. 
 * @param message Error message for validation exceptions.
 * @returns  
 */
export const queryIntValidator = ({
    fieldName,
    defValue = 0,
    typeParams = { min: -2147483648, max: 2147483647 },
    message = base.validationFailed
}: validateQueryInt): ValidationChain => {
    return query(fieldName, base.intValidationFailed)
        .default(defValue)
        .isInt(typeParams)
        .withMessage(message)
};
