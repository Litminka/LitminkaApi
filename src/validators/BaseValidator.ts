import { ValidatorErrorMessage } from '@/ts/errors';
import { baseMsg } from '@/ts/messages';
import { ValidationChain, ValidationError } from 'express-validator';
import {
    TypeBaseValidator,
    TypeBoolValidator,
    TypeDateValidator,
    TypeIntValidator,
    TypeUUIDValidator
} from '@/ts/baseValidator';

/**
 * Generate message object with range for `is<Type>()` validator options by min-max value.
 * @param arg
 * @returns ValidatorErrorMessage
 */
export function genMessage(arg: {
    message: string | ValidationError | ValidatorErrorMessage | any;

    typeParams: { min?: number; max?: number; [key: string]: any };
}): ValidatorErrorMessage {
    const setRange = (arg: { min?: number; max?: number }) => {
        return [arg.min ?? null, arg.max ?? null];
    };

    if (typeof arg.message === 'string')
        return {
            msg: arg.message,
            range: setRange(arg.typeParams)
        };

    arg.message.range = setRange(arg.typeParams);
    return arg.message;
}

/**
 * Validate array, input value will be casts to array, so it can be any btw.
 * If you want get casted value, you must use express [matchedData()](https://express-validator.github.io/docs/api/matched-data/#matcheddata).
 * @param validator Express [check()](https://express-validator.github.io/docs/api/check/#check) ValidationChain
 * @param typeParams Express [isArray()](https://express-validator.github.io/docs/api/validation-chain/#isarray) options object. By default limits array length to 50 elements.
 * @returns ValidationChain
 */
export const arrayValidator = ({
    validator,
    typeParams = {}
}: TypeBaseValidator): ValidationChain => {
    return validator
        .toArray()
        .custom((value) => {
            const options = {
                min: typeParams.min ?? 1,
                max: typeParams.max ?? 50
            };

            if (!Array.isArray(value)) throw new Error(baseMsg.valueMustBeAnArray);
            if (value.length < options.min || value.length > options.max) {
                const message: any = genMessage({
                    message: baseMsg.valueNotInRange,
                    typeParams
                });
                const msg: string = message.msg;
                delete message.msg;
                throw new Error(msg, message);
            }
            return true;
        })
        .withMessage(genMessage({ message: baseMsg.valueMustBeAnArray, typeParams }));
};

/**
 * Validate string parameter.
 * @param validator Express [check()](https://express-validator.github.io/docs/api/check/#check) ValidationChain.
 * @param typeParams Express [isLength()](https://express-validator.github.io/docs/api/validation-chain/#islength) options object. By default limits string length to 32 characters.
 * @returns ValidationChain
 */
export const stringValidator = ({ validator, typeParams }: TypeBaseValidator): ValidationChain => {
    typeParams = typeParams ?? {};
    typeParams = {
        min: typeParams.min ?? 1,
        max: typeParams.max ?? 64
    };
    return validator
        .notEmpty()
        .withMessage(baseMsg.notProvided)
        .bail()
        .isString()
        .withMessage(baseMsg.valueMustBeString)
        .bail()
        .isLength(typeParams)
        .withMessage(
            genMessage({
                message: baseMsg.valueNotInRange,
                typeParams
            })
        );
};

/**
 * Validate integer parameter, tries cast value to int.
 * If you want get casted value, you must use express [matchedData()](https://express-validator.github.io/docs/api/matched-data/#matcheddata).
 * @param validator Express [check()](https://express-validator.github.io/docs/api/check/#check) ValidationChain .
 * @param typeParams Express [isInt()](https://express-validator.github.io/docs/api/validation-chain/#isint) options object. By default limits by positive int32 values except 0.
 * @returns ValidationChain
 */
export const intValidator = ({ validator, typeParams = {} }: TypeIntValidator): ValidationChain => {
    return validator
        .custom((value) => {
            value = Number(value);

            if (isNaN(value)) throw new Error(baseMsg.valueMustBeInt);
            if (typeof typeParams === 'undefined') typeParams = {};

            const options: { min: number; max: number } = {
                min: typeParams.min ?? -2147483648,
                max: typeParams.max ?? 2147483647
            };

            if (!Number.isInteger(value)) throw new Error(baseMsg.valueMustBeInt);
            if (value < options.min || value > options.max) {
                const message: any = genMessage({
                    message: baseMsg.valueNotInRange,
                    typeParams
                });
                const msg: string = message.msg;
                delete message.msg;
                throw new Error(msg, message);
            }
            return true;
        })
        .toInt()
        .withMessage(
            genMessage({
                message: baseMsg.valueMustBeInt,
                typeParams
            })
        );
};

/**
 * Validate bool parameter.
 * @param validator Express [check()](https://express-validator.github.io/docs/api/check/#check) ValidationChain.
 * @param typeParams Express [isBoolean()](https://express-validator.github.io/docs/api/validation-chain/#isboolean) options object.
 * @returns ValidationChain
 */
export const boolValidator = ({ validator, typeParams }: TypeBoolValidator): ValidationChain => {
    return validator.isBoolean(typeParams).toBoolean().withMessage(baseMsg.valueMustBeBool);
};

/**
 * Validate uuid parameter.
 * @param validator Express [check()](https://express-validator.github.io/docs/api/check/#check) ValidationChain.
 * @param typeParams Express [isUUID()](https://express-validator.github.io/docs/api/validation-chain/#isuuid) options object.
 * @returns ValidationChain
 */
export const uuidValidator = ({ validator }: TypeUUIDValidator): ValidationChain => {
    return validator
        .notEmpty()
        .withMessage(baseMsg.notProvided)
        .bail()
        .isUUID()
        .withMessage(baseMsg.valueMustBeUUID);
};

/**
 * Validate date parameter.
 * @param validator Express [check()](https://express-validator.github.io/docs/api/check/#check) ValidationChain.
 * @param typeParams Express [isDate()](https://express-validator.github.io/docs/api/validation-chain/#isdate) options object.
 * @returns ValidationChain
 */
export const dateValidator = ({ validator, typeParams }: TypeDateValidator): ValidationChain => {
    return validator.isDate(typeParams).withMessage(baseMsg.valueMustBeDate);
};
export { TypeBaseValidator };
