import { ValidationChain, query } from 'express-validator';
import { baseMsg } from '@/ts/messages';
import { stringValidator } from '@/validators/BaseValidator';
import { BaseValidator, IntValidator } from '@/validators/BaseValidator';
import { intValidator } from '@/validators/BaseValidator';

interface QueryIntValidator extends IntValidator {
    defValue: number;
}

/**
 * Validate optional integer query parameter with default value
 * @param fieldName Parameter name
 * @param options.defValue Default value if parameter `undefined` or `null`
 * @param options.typeParams Express [isint()](https://express-validator.github.io/docs/api/validation-chain/#isint) options object.
 * @param options.message Error message for validation exceptions.
 */
export const queryIntValidator = (
    fieldName: string,
    options?: QueryIntValidator
): ValidationChain => {
    const defValue = options?.defValue ?? 0;
    const typeParams = options?.typeParams;
    const message = options?.message ?? baseMsg.valueMustBeInt;

    return intValidator({
        validator: query(fieldName, message).default(defValue),
        typeParams
    });
};

/**
 * Validate required `string` query parameter.
 * @param fieldName Parameter name
 * @param options.typeParams Express [isLength()](https://express-validator.github.io/docs/api/validation-chain/#islength) options object. By default limited by 32 characters length.
 * @param options.message Error message for validation exceptions.
 */
export const queryStringValidator = (
    fieldName: string,
    options?: BaseValidator
): ValidationChain => {
    const typeParams = options?.typeParams;
    const message = options?.message ?? baseMsg.valueMustBeString;

    return stringValidator({
        validator: query(fieldName, message),
        typeParams
    });
};
