import { baseMsg } from '@/ts/messages';
import { body, ValidationChain } from 'express-validator';
import {
    BaseValidator,
    intValidator,
    stringValidator,
    boolValidator,
    uuidValidator,
    arrayValidator,
    BoolValidator,
    UUIDValidator,
    IntValidator
} from '@validators/BaseValidator';

// 🕷️: Why are we still here?
// 🕷️: Just to suffer?
// 🕷️: Every night, I can feel my leg...
// 🕷️: And my arm... even my fingers...
// 🕷️: The body I've lost... the comrades
// 🕷️: I've lost... won't stop hurting...
// 🕷️: It's like they're all still there.
// 🕷️: You feel it, too, don't you?
// 🕷️: I'm gonna make them give back our past!

/**
 * Validate required array[any] body parameter.
 * @param fieldName Parameter name
 * @param typeParams Express [isArray()](https://express-validator.github.io/docs/api/validation-chain/#isarray) options object. By default limits array length to 50 elements.
 * @param message Error message for validation exceptions.
 */
export const bodyArrayValidator = (fieldName: string, options?: BaseValidator): ValidationChain => {
    const typeParams = options?.typeParams ?? { min: 0, max: 50 };
    const message = options?.message ?? baseMsg.valueMustBeAnArray;

    return arrayValidator({
        validator: body(fieldName, message),
        typeParams
    });
};

/**
 * Validate required `string` body parameter.
 * @param fieldName Parameter name
 * @param typeParams Express [isLength()](https://express-validator.github.io/docs/api/validation-chain/#islength) options object. By default limited by 32 characters length.
 * @param message Error message for validation exceptions.
 */
export const bodyStringValidator = (
    fieldName: string,
    options?: BaseValidator
): ValidationChain => {
    const typeParams = options?.typeParams ?? { min: 0, max: 32 };
    const message = options?.message ?? baseMsg.valueMustBeString;

    return stringValidator({
        validator: body(fieldName, message),
        typeParams
    });
};

/**
 * Validate required `number` body parameter.
 * @param fieldName Parameter name
 * @param typeParams Express [isInt()](https://express-validator.github.io/docs/api/validation-chain/#isint) options object. By default limited to int32 positive numbers.
 * @param message Error message for validation exceptions.
 */
export const bodyIntValidator = (fieldName: string, options?: IntValidator): ValidationChain => {
    const typeParams = options?.typeParams ?? { min: 0, max: 32 };
    const message = options?.message ?? baseMsg.valueMustBeInt;

    return intValidator({
        validator: body(fieldName, message),
        typeParams
    });
};

/**
 * Validate required boolean body parameter
 * @param fieldName Parameter name
 * @param typeParams Express [isBoolead()](https://express-validator.github.io/docs/api/validation-chain/#isboolean) options object.
 * @param message Error message for validation exceptions.
 */
export const bodyBoolValidator = (fieldName: string, options?: BoolValidator): ValidationChain => {
    const message = options?.message ?? baseMsg.valueMustBeBool;
    const defValue = options?.defValue ?? 0;

    return boolValidator({
        validator: body(fieldName, message).default(defValue),
        typeParams: options?.typeParams
    });
};

/**
 * Validate required UUID body parameter
 * @param fieldName Parameter name
 * @param message Error message for validation exceptions.
 */
export const bodyUUIDValidator = (fieldName: string, options?: UUIDValidator): ValidationChain => {
    const message = options?.message ?? baseMsg.valueMustBeUUID;

    return uuidValidator({
        validator: body(fieldName, message)
    });
};
