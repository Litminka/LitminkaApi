import { ValidatorErrorMessage } from "@/ts";

/**
 * Base input parameters to all base validators
 */
export interface BaseValidator {
    fieldName: string,
    message: ValidatorErrorMessage,
    typeParams?: object
};
