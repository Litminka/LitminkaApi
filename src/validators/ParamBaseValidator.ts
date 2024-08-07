import { ValidationChain, param } from 'express-validator';
import { baseMsg } from '@/ts/messages';
import { intValidator, stringValidator } from '@/validators/BaseValidator';
import { IntValidator } from '@/ts/baseValidator';

/**
 * Validate required `number` param parameter.
 * @param fieldName Parameter name
 * @param options.typeParams Express [isInt()](https://express-validator.github.io/docs/api/validation-chain/#isint) options object. By default limited to int32 positive numbers.
 * @param options.message Error message for validation exceptions. By default `message: string = "validation_failed"`
 */
export const paramIntValidator = (fieldName: string, options?: IntValidator): ValidationChain => {
    const typeParams = options?.typeParams;
    const message = options?.message ?? baseMsg.valueMustBeInt;

    return intValidator({
        validator: param(fieldName, message),
        typeParams
    });
};

/**
 * Validate required `string` param parameter.
 * @param fieldName Parameter name
 * @param options.typeParams Express [isLength()](https://express-validator.github.io/docs/api/validation-chain/#islength) options object. By default limited by 32 characters length.
 * @param options.message Error message for validation exceptions.
 */
export const paramStringValidator = (
    fieldName: string,
    options?: IntValidator
): ValidationChain => {
    const typeParams = options?.typeParams;
    const message = options?.message ?? baseMsg.valueMustBeString;

    return stringValidator({
        validator: param(fieldName, message),
        typeParams
    });
};
