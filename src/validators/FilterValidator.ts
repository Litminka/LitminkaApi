import { body } from "express-validator";
import { validationError } from "../middleware/validationError";
import dayjs from "dayjs";

const genresValidator = (): any[] => {
    return [body("genres").optional().isArray().bail(),
    body("genres.*").isInt(), validationError];
};
const yearsValidator = (): any[] => {
    return [body("years").optional().isArray().bail(),
    body("years.*").isInt({ min: 1917, max: dayjs().year() }), validationError];
};

const periodValidator = (): any[] => {
    return [body("period").optional().isArray({ min: 2, max: 2 }).bail(),
    body("period.*").isDate(), validationError];
};

const seasonsValidator = (): any[] => {
    return [
        body("seasons").optional().isArray().bail(),
        // FIXME: Not working with that method
        body("seasons.*").isString().contains([
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
    // FIXME: Not working with that method
    body("statuses.*").isString().contains([
        "ongoing",
        "released",
        "anons"
    ]), validationError];
};

const rpaRatingsValidator = (): any[] => {
    return [body("rpaRatings").optional().isArray().bail(),
    // FIXME: Not working with that method
    body("rpaRatings.*").isString().contains([
        "G",
        "PG",
        "PG-13",
        "R",
        "R+"
    ]), validationError];
};

const mediaTypesValidator = (): any[] => {
    return [body("mediaTypes").optional().isArray().bail(),
    // FIXME: Not working with that method
    body("mediaTypes.*").isString().contains([
        "tv",
        "tv_special",
        "special",
        "ona",
        "ova",
        "movie",
    ]), validationError];
}

export { genresValidator, yearsValidator, periodValidator, seasonsValidator, nameValidator, episodeValidator, statusesValidator, rpaRatingsValidator, mediaTypesValidator };