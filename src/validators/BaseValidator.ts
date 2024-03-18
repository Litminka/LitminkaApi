import { ValidationChain, body, param, query } from "express-validator";


export const validateBodyId = (fieldName: string): ValidationChain => {
    return body(fieldName).isInt().notEmpty().bail();
};

export const validateParamId = (fieldName: string): ValidationChain => {
    return param(fieldName).isInt({ min: 1, max: 2147483647 }).notEmpty().toInt();
};

export const validateUserParamId = () => {
    return query('userId').optional().isInt({ min: 1, max: 2147483647 }).bail().toInt();
}

export const validateBodyArrayId = (fieldName: string): any[] => {
    return [
        body(fieldName).toArray().isArray({ min: 1, max: 50 }),
        body(`${fieldName}.*`).isInt()
    ]
};

export const validateBodyArrayIdOptional = (fieldName: string): any[] => {
    return [
        body(fieldName).optional().toArray().isArray({ min: 1, max: 50 }),
        body(`${fieldName}.*`).isInt()
    ]
};

export const validateBodyBool = (fieldName: string): ValidationChain => {
    return body(fieldName).isBoolean()
};

interface IvalidateQueryInt {
    fieldName: string,
    defValue: any,
    message: string,
    intParams: object,
}

export const validateQueryInt = ({
    fieldName,
    defValue,
    intParams = { min: 0 },
    message = `Validation ${fieldName} was failed`
}: IvalidateQueryInt): any[] => {
    return [
        query(fieldName)
            .default(defValue)
            .isInt(intParams)
            .withMessage(message),
    ];
};
