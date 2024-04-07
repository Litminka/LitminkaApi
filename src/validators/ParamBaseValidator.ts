import { ValidationChain, param } from "express-validator";
import { baseMsg } from '@/ts/messages';
import { IntValidator, intValidator, stringValidator } from "@validators/BaseValidator";

/**
 * Validate required `number` param parameter.
 * @param fieldName Parameter name
 * @param typeParams Express [isInt()](https://express-validator.github.io/docs/api/validation-chain/#isint) options object. By default limited to int32 positive numbers.
 * @param message Error message for validation exceptions. By default `message: string = "validation_failed"`
 */
export const paramIntValidator = (fieldName: string, options?: IntValidator): ValidationChain => {
    const typeParams = options?.typeParams ?? { min: 1, max: 2147483647 };
    const message = options?.message ?? baseMsg.valueMustBeInt;

    return intValidator({
        validator: param(fieldName, message),
        typeParams
    })
};

/**
 * Validate required `string` body parameter.
 * @param fieldName Parameter name
 * @param typeParams Express [isLength()](https://express-validator.github.io/docs/api/validation-chain/#islength) options object. By default limited by 32 characters length.
 * @param message Error message for validation exceptions.
 */
export const paramStringValidator = (fieldName: string, options?: IntValidator): ValidationChain => {
    const typeParams = options?.typeParams ?? { min: 1, max: 2147483647 };
    const message = options?.message ?? baseMsg.valueMustBeInt;

    return stringValidator({
        validator: param(fieldName, message),
        typeParams
    })
};