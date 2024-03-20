import { body } from "express-validator";
import { bodyIdValidator } from "@validators/BaseValidator";
import { AnimeStatuses, AnimeSeasons, AnimePgaRatings, AnimeMediaTypes } from "@/ts/enums";

export const genresValidator = (fieldName: string): any[] => {
    return [
        body(fieldName).optional().isArray().bail(),
        bodyIdValidator({
            fieldName: `${fieldName}.*`,
            message: ""
        })
    ];
};

export const nameValidator = (fieldName: string): any[] => {
    return [
        body(fieldName).optional().isString(
        )];
};

export const seasonsValidator = (fieldName: string): any[] => {
    return [
        body(fieldName).optional().isArray().bail(),
        body(`${fieldName}.*`).isString().isIn(
            Object.values(AnimeSeasons)
        )];
};

export const bodyStatusesValidator = (fieldName: string): any[] => {
    return [
        body(fieldName).optional().isArray().bail(),
        body(`${fieldName}.*`).isString().isIn(
            Object.values(AnimeStatuses)
        )];
};

export const rpaRatingsValidator = (fieldName: string): any[] => {
    return [
        body(fieldName).optional().isArray().bail(),
        body(`${fieldName}.*`).isString().isIn(
            Object.values(AnimePgaRatings)
        )];
};

export const mediaTypesValidator = (fieldName: string): any[] => {
    return [
        body(fieldName).optional().isArray().bail(),
        body(`${fieldName}.*`).isString().isIn(
            Object.values(AnimeMediaTypes)
        )];
};
