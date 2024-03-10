import { body } from "express-validator";
import { validationError } from "../middleware/validationError";
import dayjs from "dayjs";

const genresValidator = (fieldName: string): any[] => {
    return [body(fieldName).optional().isArray().bail(),
    body(`${fieldName}.*`).isInt(), validationError];
};
const yearsValidator = (): any[] => {
    return [body("years").optional().isArray().bail(),
    body("years.*").isInt({ min: 1917, max: dayjs().year() }), validationError];
};

const seasonsValidator = (): any[] => {
    return [
        body("seasons").optional().isArray().bail(),
        body("seasons.*").isString().isIn([
            "winter",
            "spring",
            "summer",
            "fall"
        ]),
        validationError];
};


const nameValidator = (): any[] => {
    return [body("name").optional().isString(), validationError];
};

const episodeValidator = (): any[] => {
    return [body("episode").optional().isInt(), validationError];
};

const statusesValidator = (): any[] => {
    return [body("statuses").optional().isArray().bail(),
    body("statuses.*").isString().isIn([
        "ongoing",
        "released",
        "anons"
    ]), validationError];
};

const rpaRatingsValidator = (): any[] => {
    return [body("rpaRatings").optional().isArray().bail(),
    body("rpaRatings.*").isString().isIn([
        "G",
        "PG",
        "PG-13",
        "R",
        "R+"
    ]), validationError];
};

const mediaTypesValidator = (): any[] => {
    return [body("mediaTypes").optional().isArray().bail(),
    body("mediaTypes.*").isString().isIn([
        "tv",
        "tv_special",
        "special",
        "ona",
        "ova",
        "movie",
    ]), validationError];
};

export { genresValidator, yearsValidator, seasonsValidator, nameValidator, episodeValidator, statusesValidator, rpaRatingsValidator, mediaTypesValidator };