"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromWatchListValidation = exports.editWatchListValidation = exports.addToWatchListValidation = void 0;
const db_1 = require("../db");
const express_validator_1 = require("express-validator");
const addToWatchListValidation = () => {
    const watchedRange = { min: 0 };
    return [
        (0, express_validator_1.param)("anime_id").notEmpty().isInt().bail().toInt().custom((value) => __awaiter(void 0, void 0, void 0, function* () {
            const anime = yield db_1.prisma.anime.findFirst({
                where: { id: value }
            });
            if (!anime)
                throw new Error("Anime doesn't exist");
            watchedRange.max = anime.max_episodes;
        })),
        (0, express_validator_1.body)("status").notEmpty().isString().isIn(["planned", "watching", "rewatching", "completed", "on_hold", "dropped"]),
        (0, express_validator_1.body)("watched_episodes").notEmpty().isInt(watchedRange).withMessage("Amount should be min 0 and should not be larger than the amount of episodes"),
        (0, express_validator_1.body)("rating").notEmpty().isInt({ min: 0, max: 10 }),
        (0, express_validator_1.body)("is_favorite").notEmpty().isBoolean().bail().toBoolean()
    ];
};
exports.addToWatchListValidation = addToWatchListValidation;
const editWatchListValidation = () => {
    const watchedRange = { min: 0 };
    return [
        (0, express_validator_1.param)("anime_id").notEmpty().isInt().bail().toInt().custom((value) => __awaiter(void 0, void 0, void 0, function* () {
            const anime = yield db_1.prisma.anime.findFirst({
                where: { id: value }
            });
            if (!anime)
                throw new Error("Anime doesn't exist");
            watchedRange.max = anime.max_episodes;
        })),
        (0, express_validator_1.body)("status").notEmpty().isString().isIn(["planned", "watching", "rewatching", "completed", "on_hold", "dropped"]),
        (0, express_validator_1.body)("watched_episodes").notEmpty().isInt(watchedRange).withMessage("Amount should be min 0 and should not be larger than the amount of episodes"),
        (0, express_validator_1.body)("rating").notEmpty().isInt({ min: 0, max: 10 }),
        (0, express_validator_1.body)("is_favorite").notEmpty().isBoolean().bail().toBoolean()
    ];
};
exports.editWatchListValidation = editWatchListValidation;
const deleteFromWatchListValidation = () => {
    return [
        (0, express_validator_1.param)("anime_id").notEmpty().isInt().bail().toInt().custom((value) => __awaiter(void 0, void 0, void 0, function* () {
            const anime = yield db_1.prisma.anime.findFirst({
                where: { id: value }
            });
            if (!anime)
                throw new Error("Anime doesn't exist");
        })),
    ];
};
exports.deleteFromWatchListValidation = deleteFromWatchListValidation;
//# sourceMappingURL=WatchListValidator.js.map