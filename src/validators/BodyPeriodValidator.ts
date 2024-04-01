import { body, ValidationChain } from "express-validator";
import { arrayValidator, BaseValidator, dateValidator, genMessage } from "@validators/BaseValidator";
import { baseMsg } from "@/ts/messages";

/**
 * Base period validator
 * @param fieldName Parameter name
 * @param typeParams Express [isDate()](https://express-validator.github.io/docs/api/validation-chain/#isdate) options object.
 * @param message Error message for validation exceptions.  
 * @returns base date validation chain
 */
const bodyDateValidator = (fieldName: string, options?: BaseValidator): ValidationChain => {
    const message = options?.message ?? baseMsg.valueMustBeDate;

    return dateValidator({
        validator: body(`${fieldName}.*`, baseMsg.valueMustBeDate),
        typeParams: options?.typeParams,
        message
    })
};

/**
 * Validate required array[any] body parameter.
 * @param fieldName Parameter name
 * @param typeParams Express [isArray()](https://express-validator.github.io/docs/api/validation-chain/#isarray) options object.
 * @param message Error message for validation exceptions.
 * @returns Array of ValidationChain
 */
export const bodySoftPeriodValidator = (fieldName: string, options?: BaseValidator): ValidationChain[] => {
    const message = options?.message ?? baseMsg.validationFailed;

    return [
        arrayValidator({
            validator: body(fieldName).optional(),
            typeParams: { max: 2, min: 1 },
        }).bail(),
        bodyDateValidator(`${fieldName}.*`, { message, typeParams: options?.typeParams })
    ]
};

/**
 * Validate required array[any] body parameter.
 * @param fieldName Parameter name
 * @param typeParams Express [isDate()](https://express-validator.github.io/docs/api/validation-chain/#isdate) options object.
 * @param message Error message for validation exceptions.
 * @returns Array of ValidationChain
 */
export const bodyStrictPeriodValidator = (fieldName: string, options?: BaseValidator): ValidationChain[] => {


    return [
        // Validator doesn't cast value to array except arrayValidator, using unique chain
        body(fieldName)
            .optional()
            .isArray({ min: 2, max: 2 })
            .bail()
            .withMessage(genMessage({
                message: baseMsg.valueMustBeAnArray,
                typeParams: { min: 2, max: 2 }
            })),
        bodyDateValidator(`${fieldName}.*`, { message: options?.message, typeParams: options?.typeParams })
    ]
};
