import { ValidationChain, param } from "express-validator";
import { baseMsg } from '@/ts/messages';
import { BaseValidator, intValidator } from "@validators/BaseValidator";

/**
 * Validate required `number` param parameter.
 * @param fieldName Parameter name
 * @param typeParams Express [isInt()](https://express-validator.github.io/docs/api/validation-chain/#isint) options object. By default limited to int32 positive numbers.
 * @param message Error message for validation exceptions. By default `message: string = "validation_failed"`
 */
export const paramIntValidator = (fieldName: string, options?: BaseValidator): ValidationChain => {
    const typeParams = options?.typeParams ?? { min: 1, max: 2147483647 };
    const message = options?.message ?? baseMsg.valueMustBeInt;

    return intValidator({
        validator: param(fieldName, baseMsg.validationFailed),
        typeParams,
        message
    })
};
