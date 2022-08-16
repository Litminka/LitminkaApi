import { prisma } from '../db';
import { body, param } from "express-validator";

const FollowValidation = (): any[] => {
    return [
        body("group_name").notEmpty().isString().bail(),
        param("anime_id").notEmpty().isInt().bail().toInt()
    ];
};


export { FollowValidation };