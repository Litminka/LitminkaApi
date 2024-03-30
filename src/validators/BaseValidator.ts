import { ValidatorErrorMessage } from "@/ts";
import { baseMsg } from "@/ts/messages";
import { ValidationChain, ValidationError } from "express-validator";

/**
 * Base input interface to all base type validators
 */
export interface TypeBaseValidator {
    typeParams?: object
    validator: ValidationChain,
    message: string | ValidatorErrorMessage,
}

/**
 * Base input parameters to all base validators
 */
export interface BaseValidator extends Omit<TypeBaseValidator, "validator"> {
    fieldName: string,
};

/**
 * Generate message object with range for `is<Type>()` validator options by min-max value
 * @param arg 
 * @returns ValidatorErrorMessage
 */
function genMessage(
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

    if (typeof arg.message === "string") {
        return {
            msg: arg.message,
            range: setRange(arg.typeParams)
        }
    }

    if (!arg.message.hasOwnProperty("range")) arg.message.range = setRange(arg.typeParams)
    return arg.message
}

export const intValidator = ({
    validator,
    typeParams = { min: 1, max: 2147483647 },
    message = baseMsg.validationFailed
}: TypeBaseValidator): ValidationChain => {
    message = genMessage({ message, typeParams })
    return validator.isInt(typeParams)
        .toInt()
        .withMessage(message);
};

export const boolValidator = ({
    validator,
    typeParams,
}: TypeBaseValidator): ValidationChain => {
    return validator
        .isBoolean(typeParams)
        .withMessage(baseMsg.valueMustBeBool)
        .bail()
}

interface TypeUUIDValidator extends Omit<TypeBaseValidator, "typeParams"> { }
export const uuidValidator = ({
    validator,
}: TypeUUIDValidator): ValidationChain => {
    return validator
        .notEmpty()
        .bail()
        .withMessage(baseMsg.valueIsNotProvided)
        .isUUID()
        .bail()
        .withMessage(baseMsg.valueMustBeUUID)
}



