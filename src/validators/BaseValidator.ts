import { ValidatorErrorMessage } from "@/ts";
import { baseMsg } from "@/ts/messages";
import { ValidationChain, ValidationError } from "express-validator";
import { IsBooleanOptions, IsDateOptions, MinMaxOptions } from "express-validator/src/options";

/**
 * Base input interface to all base type validators
 */
export interface TypeBaseValidator {
    validator: ValidationChain
    typeParams?: MinMaxOptions
}

interface TypeIntValidator extends TypeBaseValidator {
    typeParams?: {
        min?: number,
        max?: number,
        [key: string]: any
    }
}
interface TypeDateValidator extends Omit<TypeBaseValidator, "typeParams"> { typeParams?: IsDateOptions }
interface TypeBoolValidator extends Omit<TypeBaseValidator, "typeParams"> { typeParams?: IsBooleanOptions }
interface TypeUUIDValidator extends Omit<TypeBaseValidator, "typeParams"> { }

/**
 * Base input parameters to all base validators
 */
export interface BaseValidator extends Omit<TypeBaseValidator, "validator"> {
    message?: string | ValidatorErrorMessage,
}

export interface IntValidator extends Omit<TypeIntValidator, "validator"> {
    message?: string | ValidatorErrorMessage,
}

export interface DateValidator extends Omit<TypeDateValidator, "validator"> {
    message?: string | ValidatorErrorMessage,
}

export interface BoolValidator extends Omit<TypeBoolValidator, "validator"> {
    message?: string | ValidatorErrorMessage,
    defValue?: boolean
}

export interface UUIDValidator extends Omit<TypeUUIDValidator, "validator"> {
    message?: string | ValidatorErrorMessage,
}

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
 * @returns ValidationChain
 */
export const arrayValidator = ({
    validator,
    typeParams = {}
}: TypeBaseValidator): ValidationChain => {
    return validator
        .toArray()
        .custom(value => {
            const options = {
                min: typeof typeParams.min === "undefined" ? 1 : typeParams.min,
                max: typeof typeParams.max === "undefined" ? 50 : typeParams.max
            }

            if (!Array.isArray(value)) throw new Error(baseMsg.valueMustBeAnArray)
            if (value.length < options.min || value.length > options.max) {
                let message: any = genMessage({ message: baseMsg.valueNotInRange, typeParams })
                const msg: string = message.msg; delete message.msg
                throw new Error(msg, message)
            }
            return true;
        })
        .withMessage(genMessage({ message: baseMsg.valueMustBeAnArray, typeParams }))
};

/**
 * Validate string parameter.
 * @param validator Express [check()](https://express-validator.github.io/docs/api/check/#check) ValidationChain.
 * @param typeParams Express [isLength()](https://express-validator.github.io/docs/api/validation-chain/#islength) options object. By default limits string length to 32 characters.
 * @returns ValidationChain
 */
export const stringValidator = ({
    validator,
    typeParams = { min: 0, max: 32 },
}: TypeBaseValidator): ValidationChain => {
    return validator
        .notEmpty().withMessage(baseMsg.valueIsNotProvided).bail()
        .isString().withMessage(baseMsg.valueMustBeString).bail()
        .isLength(typeParams).withMessage(genMessage({
            message: baseMsg.valueNotInRange, typeParams
        }));
};

/**
 * Validate integer parameter, tries cast value to int.
 * If you want get casted value, you must use express [matchedData()](https://express-validator.github.io/docs/api/matched-data/#matcheddata).
 * @param validator Express [check()](https://express-validator.github.io/docs/api/check/#check) ValidationChain .
 * @param typeParams Express [isInt()](https://express-validator.github.io/docs/api/validation-chain/#isint) options object. By default limits by positive int32 values except 0.
 * @returns ValidationChain
 */
export const intValidator = ({
    validator,
    typeParams = {},
}: TypeIntValidator): ValidationChain => {
    return validator
        .custom(value => {
            value = Number(value);
            if (isNaN(value)) throw new Error(baseMsg.valueMustBeInt);

            const options: { min: number, max: number } = {
                min: typeof typeParams.min === "undefined" ? -2147483648 : typeParams.min,
                max: typeof typeParams.max === "undefined" ? 2147483647 : typeParams.max
            }

            if (!Number.isInteger(value)) throw new Error(baseMsg.valueMustBeInt)
            if (value < options.min || value > options.max) {
                let message: any = genMessage({ message: baseMsg.valueNotInRange, typeParams })
                const msg: string = message.msg; delete message.msg
                throw new Error(msg, message)
            }
            return true;
        })
        .toInt().withMessage(genMessage({
            message: baseMsg.valueMustBeInt, typeParams
        }));
};

/**
 * Validate bool parameter.
 * @param validator Express [check()](https://express-validator.github.io/docs/api/check/#check) ValidationChain.
 * @param typeParams Express [isBoolean()](https://express-validator.github.io/docs/api/validation-chain/#isboolean) options object.
 * @returns ValidationChain
 */
export const boolValidator = ({
    validator,
    typeParams
}: TypeBoolValidator): ValidationChain => {
    return validator
        .isBoolean(typeParams)
        .withMessage(baseMsg.valueMustBeBool)
}

/**
 * Validate uuid parameter.
 * @param validator Express [check()](https://express-validator.github.io/docs/api/check/#check) ValidationChain.
 * @param typeParams Express [isUUID()](https://express-validator.github.io/docs/api/validation-chain/#isuuid) options object.
 * @returns ValidationChain
 */
export const uuidValidator = ({
    validator
}: TypeUUIDValidator): ValidationChain => {
    return validator
        .notEmpty().withMessage(baseMsg.valueIsNotProvided).bail()
        .isUUID().withMessage(baseMsg.valueMustBeUUID)
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
}: TypeDateValidator): ValidationChain => {
    return validator
        .isDate(typeParams).withMessage(baseMsg.valueMustBeDate)
};

