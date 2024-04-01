import { ValidationChain, query } from "express-validator";
import { baseMsg } from '@/ts/messages';
import { BaseValidator } from "@validators/BaseValidator";
import { intValidator } from "@validators/BaseValidator";
interface QueryIntValidator extends BaseValidator {
    defValue: any
};

/**
 * Validate optional integer query parameter with default value
 * @param fieldName Parameter name
 * @param defValue Default value if parameter `undefined` or `null`
 * @param typeParams Express [isint()](https://express-validator.github.io/docs/api/validation-chain/#isint) options object.
 * @param message Error message for validation exceptions.
 */
export const queryIntValidator = (fieldName: string, options?: QueryIntValidator): ValidationChain => {
    const defValue = options?.defValue ?? 0;
    const typeParams = options?.typeParams ?? { min: -2147483648, max: 2147483647 };
    const message = options?.message ?? baseMsg.valueMustBeInt;

    return intValidator({
        validator: query(fieldName, message).default(defValue),
        typeParams
    })

};
