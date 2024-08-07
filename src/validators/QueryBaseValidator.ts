import { ValidationChain, query } from 'express-validator';
import { baseMsg } from '@/ts/messages';
import {
    arrayValidator,
    boolValidator,
    dateValidator,
    stringValidator
} from '@/validators/BaseValidator';
import { BaseValidator, BoolValidator, DateValidator, IntValidator } from '@/ts/baseValidator';
import { intValidator } from '@/validators/BaseValidator';
import dayjs from 'dayjs';
import Period from '@/helper/period';

interface QueryIntValidator extends IntValidator {
    defValue?: number;
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

/**
 * Validate required boolean query parameter
 * @param fieldName Parameter name
 * @param options.typeParams Express [isBoolead()](https://express-validator.github.io/docs/api/validation-chain/#isboolean) options object.
 * @param options.message Error message for validation exceptions.
 * @param options.defValue Default value for bool parameter.
 */
export const queryBoolValidator = (fieldName: string, options?: BoolValidator): ValidationChain => {
    const message = options?.message ?? baseMsg.valueMustBeBool;
    const defValue = options?.defValue ?? false;

    return boolValidator({
        validator: query(fieldName, message).default(defValue),
        typeParams: options?.typeParams
    });
};

/**
 * Validate required array[any] query parameter.
 * @param fieldName Parameter name
 * @param options.typeParams Express [isArray()](https://express-validator.github.io/docs/api/validation-chain/#isarray) options object. By default limits array length to 50 elements.
 * @param options.message Error message for validation exceptions.
 */
export const queryArrayValidator = (
    fieldName: string,
    options?: BaseValidator
): ValidationChain => {
    const typeParams = options?.typeParams;
    const message = options?.message ?? baseMsg.valueMustBeAnArray;

    return arrayValidator({
        validator: query(fieldName, message),
        typeParams
    });
};

/**
 * Base query period validator
 * @param fieldName Parameter name
 * @param options.typeParams Express [isDate()](https://express-validator.github.io/docs/api/validation-chain/#isdate) options object.
 * @param options.message Error message for validation exceptions.
 * @returns base date validation chain
 */
const queryDateValidator = (fieldName: string, options?: DateValidator): ValidationChain => {
    const message = options?.message ?? baseMsg.valueMustBeDate;

    return dateValidator({
        validator: query(`${fieldName}.*`, message),
        typeParams: options?.typeParams
    }).toDate();
};

/**
 * Validate required array[any] query parameter.
 * @param fieldName Parameter name
 * @param options.typeParams Express [isArray()](https://express-validator.github.io/docs/api/validation-chain/#isarray) options object.
 * @param options.message Error message for validation exceptions.
 * @returns Array of ValidationChain
 */
export const querySoftPeriodValidator = (
    fieldName: string,
    options?: DateValidator
): ValidationChain[] => {
    const message = options?.message ?? baseMsg.valueMustBeDate;

    return [
        arrayValidator({
            validator: query(fieldName).optional(),
            typeParams: { min: 0, max: 2 }
        }),
        query(`${fieldName}.*`).toDate()
    ];
};
