import { ValidationChain, body, param, query } from "express-validator";
import { validationError } from "../middleware/validationError";


const validateBodyId = (fieldName: string): ValidationChain => {
    return body(fieldName).isInt().notEmpty().bail();
};

const validateParamId = (fieldName: string): ValidationChain => {
    return param(fieldName).isInt().notEmpty().toInt();
};

const validateBodyArrayId = (fieldName: string): any[] => {
    return [
        body(fieldName).toArray().isArray({ min: 1 }),
        body(`${fieldName}.*`).isInt()
    ]
};

const validateBodyBool = (fieldName: string): any[] => {
    return [body(fieldName).isBoolean(), validationError];
};

interface IvalidateParamInt {
    fieldName: string,
    defValue: any,
    message: string,
    intParams: object,
}

const validateQueryInt = ({
    fieldName,
    defValue,
    intParams = { min: 0 },
    message = `Validation ${fieldName} was failed`
}: IvalidateParamInt): any[] => {
    return [
        query(fieldName)
            .default(defValue)
            .isInt(intParams)
            .withMessage(message),
    ];
};

export { validateBodyId, validateParamId, validateBodyArrayId, validateBodyBool, validateQueryInt };