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
export const queryIntValidator = ({
    fieldName,
    defValue = 0,
    typeParams = { min: -2147483648, max: 2147483647 },
    message = baseMsg.validationFailed
}: QueryIntValidator): ValidationChain => {
    return intValidator({
        validator: query(fieldName, baseMsg.valueMustBeInt),
        typeParams,
        message
    }).default(defValue)

};
