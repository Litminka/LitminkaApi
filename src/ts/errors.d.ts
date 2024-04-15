import { ErrorMessage, FieldValidationError } from 'express-validator/src/base';

export type AdditionalValidationError = FieldValidationError & {
    additional: object;
};

export type ValidatorErrorMessage =
    | {
          msg: string;
          [key: string]: unknown;
      }
    | ErrorMessage;
