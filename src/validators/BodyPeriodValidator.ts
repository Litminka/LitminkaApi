import { body, ValidationChain } from 'express-validator';
import { arrayValidator, dateValidator, genMessage } from '@/validators/BaseValidator';
import { baseMsg } from '@/ts/messages';
import { DateValidator } from '@/ts/baseValidator';

/**
 * Base period validator
 * @param fieldName Parameter name
 * @param options.typeParams Express [isDate()](https://express-validator.github.io/docs/api/validation-chain/#isdate) options object.
 * @param options.message Error message for validation exceptions.
 * @returns base date validation chain
 */
const bodyDateValidator = (fieldName: string, options?: DateValidator): ValidationChain => {
    const message = options?.message ?? baseMsg.valueMustBeDate;

    return dateValidator({
        validator: body(`${fieldName}.*`, message),
        typeParams: options?.typeParams
    });
};

/**
 * Validate required array[any] body parameter.
 * @param fieldName Parameter name
 * @param options.typeParams Express [isArray()](https://express-validator.github.io/docs/api/validation-chain/#isarray) options object.
 * @param options.message Error message for validation exceptions.
 * @returns Array of ValidationChain
 */
export const bodySoftPeriodValidator = (
    fieldName: string,
    options?: DateValidator
): ValidationChain[] => {
    const message = options?.message ?? baseMsg.valueMustBeDate;

    return [
        arrayValidator({
            validator: body(fieldName)
                .trim()
                .notEmpty()
                .bail()
                .withMessage(baseMsg.notProvided)
                .optional(),
            typeParams: { min: 0, max: 2 }
        }).bail(),
        bodyDateValidator(`${fieldName}.*`, {
            message,
            typeParams: options?.typeParams
        })
    ];
};

/**
 * Validate required array[any] body parameter.
 * @param fieldName Parameter name
 * @param options.typeParams Express [isDate()](https://express-validator.github.io/docs/api/validation-chain/#isdate) options object.
 * @param options.message Error message for validation exceptions.
 * @returns Array of ValidationChain
 */
export const bodyStrictPeriodValidator = (
    fieldName: string,
    options?: DateValidator
): ValidationChain[] => {
    const message = options?.message ?? baseMsg.valueMustBeDate;
    const typeParams = options?.typeParams;

    return [
        // Validator doesn't cast value to array except arrayValidator, using unique chain
        body(fieldName)
            .optional()
            .custom((value) => {
                const options = { min: 2, max: 2 };

                if (!Array.isArray(value)) throw new Error(baseMsg.valueMustBeAnArray);
                if (value.length < options.min || value.length > options.max) {
                    const message: any = genMessage({
                        message: baseMsg.valueNotInRange,
                        typeParams: options
                    });
                    const msg: string = message.msg;
                    delete message.msg;
                    throw new Error(msg, message);
                }
                return true;
            })
            .bail(),
        bodyDateValidator(`${fieldName}.*`, { message, typeParams })
    ];
};
