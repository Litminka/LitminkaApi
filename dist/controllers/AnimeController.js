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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const db_1 = require("../db");
const shikimoriapi_1 = __importDefault(require("../helper/shikimoriapi"));
class AnimeController {
    static getSingleAnime(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty())
                return res.status(404).json({ message: "This anime doesn't exist" });
            const user = yield db_1.prisma.user.findFirst({
                where: {
                    id: (_a = req.auth) === null || _a === void 0 ? void 0 : _a.id,
                },
                include: {
                    integration: true,
                    shikimori_link: true,
                }
            });
            const anime_id = req.params.anime_id;
            let anime = yield db_1.prisma.anime.findFirst({
                where: { id: anime_id },
                include: {
                    genres: true,
                    anime_translations: {
                        include: {
                            group: true
                        }
                    }
                }
            });
            if (!anime)
                return res.status(404).json({ message: "This anime doesn't exist" });
            if (!user)
                return res.json({
                    body: anime
                });
            // TODO: add user role checking, and setting checking to allow shikimori requests only to specific users
            if (((anime === null || anime === void 0 ? void 0 : anime.description) != null && (anime === null || anime === void 0 ? void 0 : anime.rpa_rating) != null))
                return res.json({
                    body: anime
                });
            const shikimoriApi = new shikimoriapi_1.default(user);
            const resAnime = yield shikimoriApi.getAnimeById(anime.shikimori_id);
            if (resAnime.reqStatus !== 500 && resAnime.reqStatus !== 404) {
                const update = resAnime;
                yield db_1.prisma.anime.update({
                    where: {
                        id: anime.id
                    },
                    data: {
                        shikimori_score: parseFloat(update.score),
                        description: update.description,
                        japanese_name: update.japanese ? update.japanese[0] : null,
                        franchise_name: update.franchise,
                        rpa_rating: update.rating,
                        genres: {
                            connectOrCreate: update.genres.map((genre) => {
                                return {
                                    where: {
                                        name: genre.russian
                                    },
                                    create: {
                                        name: genre.russian
                                    }
                                };
                            }),
                        }
                    }
                });
                anime = yield db_1.prisma.anime.findFirst({
                    where: { id: anime_id },
                    include: {
                        genres: true,
                        anime_translations: {
                            include: {
                                group: true
                            }
                        }
                    }
                });
            }
            return res.json({
                body: anime
            });
        });
    }
}
exports.default = AnimeController;
//# sourceMappingURL=AnimeController.js.map