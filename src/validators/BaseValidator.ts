import { ValidatorErrorMessage } from "@/ts";
import { baseMsg } from "@/ts/messages";
import { ValidationChain, ValidationError } from "express-validator";

/**
 * Base input interface to all base type validators
 */
export interface TypeBaseValidator {
    typeParams?: object
    validator: ValidationChain,
    message?: string | ValidatorErrorMessage,
}

/**
 * Base input parameters to all base validators
 */
export interface BaseValidator extends Omit<TypeBaseValidator, "validator"> {}

/**
 * Generate message object with range for `is<Type>()` validator options by min-max value.
 * @param arg 
 * @returns ValidatorErrorMessage
 */
export function genMessage(
    arg: {
        message: string | ValidationError | ValidatorErrorMessage | any,
        typeParams: { min?: number, max?: number, [key: string]: any }
    }
): ValidatorErrorMessage {
    const setRange = (arg: { min?: number, max?: number }) => {
        return [
            arg.hasOwnProperty("min") || typeof arg.min !== "undefined" ? arg.min! : null,
            arg.hasOwnProperty("max") || typeof arg.max !== "undefined" ? arg.max! : null,
        ]
    }

    if (typeof arg.message === "string") return {
        msg: arg.message,
        range: setRange(arg.typeParams)
    }

    arg.message.range = setRange(arg.typeParams)
    return arg.message
}

/**
 * Validate array, input value will be casts to array, so it can be any btw.
 * If you want get casted value, you must use express [matchedData()](https://express-validator.github.io/docs/api/matched-data/#matcheddata).
 * @param validator Express [check()](https://express-validator.github.io/docs/api/check/#check) ValidationChain 
 * @param typeParams Express [isArray()](https://express-validator.github.io/docs/api/validation-chain/#isarray) options object. By default limits array length to 50 elements.
 * @param message Error message for validation exceptions.
 * @returns ValidationChain
 */
export const arrayValidator = ({
    validator,
    typeParams = { min: 0, max: 50 },
    message = baseMsg.valueMustBeAnArray
}: TypeBaseValidator): ValidationChain => {
    return validator
        // .isArray()
        // .withMessage("Type is cringe")
        // .isArray(typeParams)
        // .withMessage("Array length is cringe")
        .custom(value => {
            const options: { min?: number, max?: number } = typeParams
            const min = typeof options.min === "undefined" ? 0 : options.min
            const max = typeof options.max === "undefined" ? 4294967294 : options.max

            if (!Array.isArray(value)) throw new Error(baseMsg.valueMustBeAnArray)
            if (value.length > min || value.length < max) {
                let message: any = genMessage({ message: baseMsg.valueNotInRange, typeParams })
                const msg: string = message.msg; delete message.msg
                throw new Error(msg, message)
            }
        })
        .toArray()
        .withMessage(genMessage({ message, typeParams }))
};

/**
 * Validate string parameter.
 * @param validator Express [check()](https://express-validator.github.io/docs/api/check/#check) ValidationChain.
 * @param typeParams Express [isLength()](https://express-validator.github.io/docs/api/validation-chain/#islength) options object. By default limits string length to 32 characters.
 * @param message Error message for validation exceptions.
 * @returns ValidationChain
 */
export const stringValidator = ({
    validator,
    typeParams = { min: 0, max: 32 },
    message = baseMsg.valueMustBeString
}: TypeBaseValidator): ValidationChain => {
    return validator
        .notEmpty()
        .bail()
        .withMessage(baseMsg.valueIsNotProvided)
        .isString()
        .isLength(typeParams)
        .withMessage(genMessage({ message, typeParams }));
};

/**
 * Validate integer parameter, tries cast value to int.
 * If you want get casted value, you must use express [matchedData()](https://express-validator.github.io/docs/api/matched-data/#matcheddata).
 * @param validator Express [check()](https://express-validator.github.io/docs/api/check/#check) ValidationChain .
 * @param typeParams Express [isInt()](https://express-validator.github.io/docs/api/validation-chain/#isint) options object. By default limits by positive int32 values except 0.
 * @param message Error message for validation exceptions.
 * @returns ValidationChain
 */
export const intValidator = ({
    validator,
    typeParams = { min: 1, max: 2147483647 },
    message = baseMsg.valueMustBeInt
}: TypeBaseValidator): ValidationChain => {
    return validator
        .isInt(typeParams)
        .toInt()
        .withMessage(genMessage({ message, typeParams }));
};

/**
 * Validate bool parameter.
 * @param validator Express [check()](https://express-validator.github.io/docs/api/check/#check) ValidationChain.
 * @param typeParams Express [isBoolean()](https://express-validator.github.io/docs/api/validation-chain/#isboolean) options object.
 * @param message Error message for validation exceptions.
 * @returns ValidationChain
 */
export const boolValidator = ({
    validator,
    typeParams,
    message = baseMsg.valueMustBeBool
}: TypeBaseValidator): ValidationChain => {
    return validator
        .isBoolean(typeParams)
        .withMessage(message)
}

interface TypeUUIDValidator extends Omit<TypeBaseValidator, "typeParams"> { }

/**
 * Validate uuid parameter.
 * @param validator Express [check()](https://express-validator.github.io/docs/api/check/#check) ValidationChain.
 * @param typeParams Express [isUUID()](https://express-validator.github.io/docs/api/validation-chain/#isuuid) options object.
 * @param message Error message for validation exceptions.
 * @returns ValidationChain
 */
export const uuidValidator = ({
    validator,
    message = baseMsg.valueMustBeUUID
}: TypeUUIDValidator): ValidationChain => {
    return validator
        .notEmpty()
        .bail()
        .withMessage(baseMsg.valueIsNotProvided)
        .isUUID()
        .withMessage(message)
}

/**
 * Validate date parameter.
 * @param validator Express [check()](https://express-validator.github.io/docs/api/check/#check) ValidationChain.
 * @param typeParams Express [isDate()](https://express-validator.github.io/docs/api/validation-chain/#isdate) options object.
 * @param message Error message for validation exceptions.
 * @returns ValidationChain
 */
export const dateValidator = ({
    validator,
    typeParams,
    message = baseMsg.valueMustBeDate
}: TypeBaseValidator): ValidationChain => {
    return validator
        .isDate(typeParams)
        .withMessage(message)
};

