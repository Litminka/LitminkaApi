import { ValidationChain, param } from "express-validator";
import { baseMsg } from '@/ts/messages';
import { BaseValidator } from "./BaseValidator";

/**
 * Validate required `number` param parameter.
 * @param fieldName Parameter name
 * @param typeParams Express [isArray()](https://express-validator.github.io/docs/api/validation-chain/#isarray) options object. By default limits array length to 50 elements.
 * @param message Error message for validation exceptions. By default `message: string = "validation_failed"`
 */
export const paramIdValidator = ({
    fieldName,
    typeParams = { min: 1, max: 2147483647 },
    message = baseMsg.validationFailed
}: BaseValidator): ValidationChain => {
    return param(fieldName)
        .isInt(typeParams)
        .toInt()
        .withMessage(message);
};
