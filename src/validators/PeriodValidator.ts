import { body } from "express-validator";
import { BaseValidator } from "./BaseValidator";

const bodyPeriodValidator = ({
    fieldName,
    typeParams,
    message
}: BaseValidator): any[] => {
    return [
        body(`${fieldName}.*`).isDate(typeParams).withMessage(message)
    ]
};

export const bodySoftPeriodValidator = ({
    fieldName,
    typeParams,
    message
}: BaseValidator): any[] => {
    return [
        body(fieldName)
            .optional()
            .toArray()
            .isArray({ max: 2, min: 1 })
            .bail(),
        bodyPeriodValidator({ fieldName, message, typeParams })
    ]
};

export const bodyStrictPeriodValidator = ({
    fieldName,
    typeParams,
    message
}: BaseValidator): any[] => {
    return [
        body(fieldName)
            .optional()
            .isArray({ min: 2, max: 2 })
            .bail(),
        bodyPeriodValidator({ fieldName, message, typeParams })
    ]
};
