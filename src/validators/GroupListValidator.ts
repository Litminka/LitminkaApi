import { body, param } from "express-validator";
import prisma from "../db";
interface minmax {
    min: number,
    max?: number
}

export const CreateGroupListValidator = (): any[] => {
    return [
        body("name").notEmpty().bail().isString().bail(),
        body("description").notEmpty().bail().isString().bail(),
    ];
};
export const GroupInviteValidation = (): any[] => {
    return [
        param("groupId").isInt().bail().toInt(),
        body("userId").isInt().bail().toInt(),
    ];
};

export const GroupListIdValidation = (): any[] => {
    return [
        param("groupId").isInt().bail().toInt(),
    ];
};

export const GroupListIdWithUserIdValidator = (): any[] => {
    return [
        param("groupId").isInt().bail().toInt(),
        body("userId").isInt().bail().toInt(),
    ];
}

export const UpdateGroupListValidator = (): any[] => {
    return [
        param("groupId").isInt().bail().toInt(),
        body("name").optional().notEmpty().bail().isString().bail(),
        body("description").optional().notEmpty().bail().isString().bail(),
    ];
}

export const GroupInviteIdValidator = (): any[] => {
    return [
        param("inviteId").isInt().bail().toInt(),
    ]
}

export const GroupInviteActionValidation = (): any[] => {
    return [
        param("inviteId").isInt().bail().toInt(),
        body("modifyList").optional().isBoolean().bail().toBoolean(),
    ];
}

export const AddToGroupListValidation = (): any[] => {
    const watchedRange: minmax = { min: 0 };
    return [
        param("groupId").isInt().bail().toInt(),
        param("animeId").bail().toInt().custom(async value => {
            const anime = await prisma.anime.findFirst({
                where: { id: value }
            });
            if (!anime) throw new Error("Anime doesn't exist");
            watchedRange.max = anime.maxEpisodes;
        }).bail(),
        body("status").notEmpty().bail().isString().bail().isIn(["planned", "watching", "rewatching", "completed", "on_hold", "dropped"]),
        body("watchedEpisodes").notEmpty().bail().isInt(watchedRange).withMessage("Amount should be min 0 and should not be larger than the amount of episodes"),
        body("rating").notEmpty().bail().isInt({ min: 0, max: 10 }),
        body("isFavorite").notEmpty().bail().isBoolean().bail().toBoolean(),
    ]
}

