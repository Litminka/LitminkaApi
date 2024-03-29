import { ValidationChain, param } from "express-validator";
import { baseMsg } from '@/ts/messages';
import { BaseValidator } from "@validators/BaseValidator";

/**
 * Validate required `number` param parameter.
 * @param fieldName Parameter name
 * @param typeParams Express [isInt()](https://express-validator.github.io/docs/api/validation-chain/#isint) options object. By default limited to int32 positive numbers.
 * @param message Error message for validation exceptions. By default `message: string = "validation_failed"`
 */
export const paramIntValidator = ({
    fieldName,
    typeParams = { min: 1, max: 2147483647 },
    message = baseMsg.validationFailed
}: BaseValidator): ValidationChain => {
    return param(fieldName)
        .isInt(typeParams)
        .toInt()
        .withMessage(message);
};