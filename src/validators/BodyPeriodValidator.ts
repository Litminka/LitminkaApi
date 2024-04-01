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
        validator: body(`${fieldName}.*`, message),
        typeParams: options?.typeParams
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
    const message = options?.message ?? baseMsg.valueMustBeDate;

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
    const message = options?.message ?? baseMsg.valueMustBeDate;
    const typeParams = { min: 2, max: 2 }

    return [
        // Validator doesn't cast value to array except arrayValidator, using unique chain
        body(fieldName).optional()
            .custom(value => {
                const options: { min?: number, max?: number } = typeParams
                const min = typeof options.min === "undefined" ? 1 : options.min
                const max = typeof options.max === "undefined" ? 150 : options.max

                if (!Array.isArray(value)) throw new Error(baseMsg.valueMustBeAnArray)
                if (value.length < min || value.length > max) {
                    let message: any = genMessage({ message: baseMsg.valueNotInRange, typeParams })
                    const msg: string = message.msg; delete message.msg
                    throw new Error(msg, message)
                }
                return true;
            })
            .withMessage(genMessage({ message: baseMsg.valueMustBeAnArray, typeParams }))
            .bail(),
        bodyDateValidator(`${fieldName}.*`, { message, typeParams: options?.typeParams })
    ]
};
