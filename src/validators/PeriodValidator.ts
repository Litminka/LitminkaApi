import { body } from "express-validator";

const periodValidator = (fieldName: string): any[] => {
    return [
        body(`${fieldName}.*`).isDate()
    ]
};

export const softPeriodValidator = (fieldName: string): any[] => {
    return [
        body(fieldName)
            .optional()
            .toArray()
            .isArray({ max: 2, min: 1 })
            .bail(),
        periodValidator(fieldName)
    ]
};

export const strictPeriodValidator = (fieldName: string): any[] => {
    return [
        body(fieldName)
            .optional()
            .isArray({ min: 2, max: 2 })
            .bail(),
        periodValidator(fieldName)
    ]
};
