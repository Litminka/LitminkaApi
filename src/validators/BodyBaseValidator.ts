import { baseMsg } from "@/ts/messages";
import { body, ValidationChain } from "express-validator";
import { BaseValidator } from "@validators/BaseValidator";

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
 * @param ifNotTypeParamsMessage Error message for validation exceptions. By default `ifNotTypeParamsMessage: string = "value_must_be_an_array"`
 */
export const bodyArrayValidator = ({
    fieldName,
    typeParams = { min: 0, max: 50 },
    ifNotTypeMessage = baseMsg.valueMustBeAnArray,
    ifNotTypeParamsMessage = baseMsg.valueMustBeAnArray
}: BaseValidator): ValidationChain => {
    return body(fieldName, baseMsg.validationFailed)
        .toArray()
        .isArray(typeParams)
        .withMessage(ifNotTypeParamsMessage)
};

/**
 * Validate optional array[any] body parameter.
 * @param fieldName Parameter name
 * @param typeParams Express [isArray()](https://express-validator.github.io/docs/api/validation-chain/#isarray) options object. By default limits array length to 50 elements.
 * @param ifNotTypeParamsMessage Error message for validation exceptions. By default `ifNotTypeParamsMessage: string = "value_must_be_an_array"`
 */
export const bodyArrayOptionalValidator = ({
    fieldName,
    typeParams = { min: 0, max: 50 },
    ifNotTypeParamsMessage = baseMsg.valueMustBeAnArray
}: BaseValidator): ValidationChain => {
    return body(fieldName)
        .optional()
        .toArray()
        .isArray(typeParams)
        .withMessage(ifNotTypeParamsMessage)
};

/**
 * Validate required `string` body parameter.
 * @param fieldName Parameter name
 * @param typeParams Express [isLength()](https://express-validator.github.io/docs/api/validation-chain/#islength) options object. By default limited by 32 characters length.
 * @param ifEmptyMessage Error message for validation exceptions. By default `ifEmptyMessage: string = "value_is_not_provided"`
 * @param ifNotTypeMessage Error message for validation exceptions. By default `ifNotTypeMessage: string = "value_must_be_string"`
 * @param ifNotTypeParamsMessage Error message for validation exceptions. By default `ifNotTypeParamsMessage: string = "validation_failed"`
 */
export const bodyStringValidator = ({
    fieldName,
    typeParams = { min: 0, max: 32 },
    ifEmptyMessage = baseMsg.valueIsNotProvided,
    ifNotTypeMessage = baseMsg.valueMustBeString,
    ifNotTypeParamsMessage = baseMsg.validationFailed
}: BaseValidator): ValidationChain => {
    return body(fieldName, baseMsg.validationFailed)
        .notEmpty()
        .bail()
        .withMessage(ifEmptyMessage)
        .isString()
        .bail()
        .withMessage(ifNotTypeMessage)
        .isLength(typeParams)
        .withMessage(ifNotTypeParamsMessage);
};

/**
 * Validate optional `string` body parameter.
 * @param fieldName Parameter name
 * @param typeParams Express [isLength()](https://express-validator.github.io/docs/api/validation-chain/#islength) options object. By default limited by 32 characters length.
 * @param ifNotTypeMessage Error message for validation exceptions. By default `ifNotTypeMessage: string = "value_must_be_string"`
 * @param ifNotTypeParamsMessage Error message for validation exceptions. By default `ifNotTypeParamsMessage: string = "validation_failed"`
 */
export const bodyStringOptionalValidator = ({
    fieldName,
    typeParams = { min: 0, max: 32 },
    ifNotTypeMessage = baseMsg.valueMustBeString,
    ifNotTypeParamsMessage = baseMsg.validationFailed
}: BaseValidator): ValidationChain => {
    return body(fieldName, baseMsg.validationFailed)
        .optional()
        .isString()
        .bail()
        .withMessage(ifNotTypeMessage)
        .isLength(typeParams)
        .withMessage(ifNotTypeParamsMessage);
};

/**
 * Validate required `number` body parameter.
 * @param fieldName Parameter name
 * @param typeParams Express [isInt()](https://express-validator.github.io/docs/api/validation-chain/#isint) options object. By default limited to int32 positive numbers.
 * @param ifEmptyMessage Error message for validation exceptions. By default `ifEmptyMessage: string = "value_is_not_provided"`
 * @param ifNotTypeMessage Error message for validation exceptions. By default `ifNotTypeMessage: string = "value_must_be_int"`
 * @param ifNotTypeParamsMessage Error message for validation exceptions. By default `ifNotTypeParamsMessage: string = "validation_failed"`
 */
export const bodyIntValidator = ({
    fieldName,
    typeParams = { min: 1, max: 2147483647 },
    ifEmptyMessage = baseMsg.valueIsNotProvided,
    ifNotTypeMessage = baseMsg.valueMustBeInt,
    ifNotTypeParamsMessage = baseMsg.validationFailed
}: BaseValidator): ValidationChain => {
    return body(fieldName, baseMsg.validationFailed)
        .notEmpty()
        .bail()
        .withMessage(ifEmptyMessage)
        .isInt(typeParams)
        .bail()
        .withMessage(ifNotTypeMessage)
        .toInt()
        .withMessage(ifNotTypeParamsMessage);
};

/**
 * Validate required boolean body parameter
 * @param fieldName Parameter name
 * @param typeParams Express [isBoolead()](https://express-validator.github.io/docs/api/validation-chain/#isboolean) options object. 
 * @param ifEmptyMessage Error message for validation exceptions. By default `ifEmptyMessage: string = "value_is_not_provided"`
 * @param ifNotTypeMessage Error message for validation exceptions. By default `ifNotTypeMessage: string = "value_must_be_boolean"`
 */
export const bodyBoolValidator = ({
    fieldName,
    typeParams,
    ifEmptyMessage = baseMsg.valueIsNotProvided,
    ifNotTypeMessage = baseMsg.valueMustBeBool
}: BaseValidator): ValidationChain => {
    return body(fieldName, baseMsg.validationFailed)
        .notEmpty()
        .bail()
        .withMessage(ifEmptyMessage)
        .isBoolean(typeParams)
        .bail()
        .withMessage(ifNotTypeMessage)
};

interface bodyUUIDValidator extends BaseValidator {
    typeParams?: never
}

/**
 * Validate required UUID body parameter
 * @param fieldName Parameter name
 * @param ifEmptyMessage Error message for validation exceptions. By default `ifEmptyMessage: string = "value_is_not_provided"`
 * @param ifNotTypeMessage Error message for validation exceptions. By default `ifNotTypeMessage: string = "value_must_be_UUID"`
 */
export const bodyUUIDValidator = ({
    fieldName,
    ifEmptyMessage = baseMsg.valueIsNotProvided,
    ifNotTypeMessage = baseMsg.valueMustBeUUID
}: bodyUUIDValidator): ValidationChain => {
    return body(fieldName, baseMsg.validationFailed)
        .notEmpty()
        .bail()
        .withMessage(ifEmptyMessage)
        .isUUID()
        .bail()
        .withMessage(ifNotTypeMessage)
};
