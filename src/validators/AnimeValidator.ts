import { body } from "express-validator";

const genresValidator = (fieldName: string): any[] => {
    return [body(fieldName).optional().isArray().bail(),
    body(`${fieldName}.*`).isInt()
    ];
};

const nameValidator = (fieldName: string): any[] => {
    return [body(fieldName).optional().isString()];
};

const seasonsValidator = (fieldName: string): any[] => {
    return [
        body(fieldName).optional().isArray().bail(),
        body(`${fieldName}.*`).isString().isIn([
            "winter",
            "spring",
            "summer",
            "fall"
        ])];
};

const statusesValidator = (fieldName: string): any[] => {
    return [body(fieldName).optional().isArray().bail(),
    body(`${fieldName}.*`).isString().isIn([
        "ongoing",
        "released",
        "announced"
    ])];
};

const rpaRatingsValidator = (fieldName: string): any[] => {
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

const mediaTypesValidator = (fieldName: string): any[] => {
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

export { genresValidator, seasonsValidator, nameValidator, statusesValidator, rpaRatingsValidator, mediaTypesValidator };