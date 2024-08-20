import { IsBooleanOptions, IsDateOptions, MinMaxOptions } from 'express-validator/lib/options';
import { ValidationChain } from 'express-validator';
import { ValidatorErrorMessage } from '@/ts/errors';

/**
 * Base input interface to all base type validators
 */
export interface TypeBaseValidator {
    validator: ValidationChain;
    typeParams?: MinMaxOptions;
}

interface TypeIntValidator extends TypeBaseValidator {
    typeParams?: {
        min?: number;
        max?: number;
        [key: string]: any;
    };
}
interface TypeDateValidator extends Omit<TypeBaseValidator, 'typeParams'> {
    typeParams?: IsDateOptions;
}
interface TypeBoolValidator extends Omit<TypeBaseValidator, 'typeParams'> {
    typeParams?: IsBooleanOptions;
}
interface TypeUUIDValidator extends Omit<TypeBaseValidator, 'typeParams'> {}

/**
 * Base input parameters to all base validators
 */
export interface BaseValidator extends Omit<TypeBaseValidator, 'validator'> {
    message?: string | ValidatorErrorMessage;
}

export interface IntValidator extends Omit<TypeIntValidator, 'validator'> {
    message?: string | ValidatorErrorMessage;
}

export interface DateValidator extends Omit<TypeDateValidator, 'validator'> {
    message?: string | ValidatorErrorMessage;
}

export interface BoolValidator extends Omit<TypeBoolValidator, 'validator'> {
    message?: string | ValidatorErrorMessage;
    defValue?: boolean;
}

export interface UUIDValidator extends Omit<TypeUUIDValidator, 'validator'> {
    message?: string | ValidatorErrorMessage;
}
