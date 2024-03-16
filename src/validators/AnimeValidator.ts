import { validateParamId } from "@validators/BaseValidator";
import { body } from "express-validator";

export const AnimeValidation = (): any[] => {
    return [
        validateParamId('animeId')
    ]
};

export const genresValidator = (fieldName: string): any[] => {
    return [body(fieldName).optional().isArray().bail(),
    body(`${fieldName}.*`).isInt()
    ];
};

export const nameValidator = (fieldName: string): any[] => {
    return [body(fieldName).optional().isString()];
};

export const seasonsValidator = (fieldName: string): any[] => {
    return [
        body(fieldName).optional().isArray().bail(),
        body(`${fieldName}.*`).isString().isIn([
            "winter",
            "spring",
            "summer",
            "fall"
        ])];
};

export const statusesValidator = (fieldName: string): any[] => {
    return [body(fieldName).optional().isArray().bail(),
    body(`${fieldName}.*`).isString().isIn([
        "ongoing",
        "released",
        "announced"
    ])];
};

export const rpaRatingsValidator = (fieldName: string): any[] => {
    return [body(fieldName).optional().isArray().bail(),
    body(`${fieldName}.*`).isString().isIn([
        "G",
        "PG",
        "PG-13",
        "R",
        "R+",
        "RX"
    ])];
};

export const mediaTypesValidator = (fieldName: string): any[] => {
    return [body(fieldName).optional().isArray().bail(),
    body(`${fieldName}.*`).isString().isIn([
        "tv",
        "tv_special",
        "special",
        "ona",
        "ova",
        "movie",
    ])];
};
