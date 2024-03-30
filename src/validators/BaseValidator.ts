import { ValidatorErrorMessage } from "@/ts";

/**
 * Base input parameters to all base validators
 */
export interface BaseValidator {
    fieldName: string,
    ifEmptyMessage?: ValidatorErrorMessage,
    ifNotTypeMessage?: ValidatorErrorMessage,
    ifNotTypeParamsMessage?: ValidatorErrorMessage,
    typeParams?: object
};
