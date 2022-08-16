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
const shikimoriapi_1 = __importDefault(require("../helper/shikimoriapi"));
const express_validator_1 = require("express-validator");
const db_1 = require("../db");
const kodikapi_1 = __importDefault(require("../helper/kodikapi"));
class WatchListController {
    static getWatchList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.auth;
            let user;
            try {
                user = yield db_1.prisma.user.findFirstOrThrow({
                    where: { id },
                    include: {
                        anime_List: {
                            include: {
                                anime: true
                            }
                        }
                    }
                });
            }
            catch (error) {
                return res.status(403).json({ message: "unauthorized" });
            }
            return res.json(user.anime_List);
        });
    }
    static importList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.auth;
            let user;
            try {
                user = yield db_1.prisma.user.findFirstOrThrow({
                    where: { id },
                    include: {
                        integration: true,
                        shikimori_link: true,
                    }
                });
            }
            catch (error) {
                return res.status(403).json({ message: "unauthorized" });
            }
            const shikimoriapi = new shikimoriapi_1.default(user);
            let animeList = yield shikimoriapi.getUserList();
            if (!animeList)
                return res.status(401).json({
                    message: 'User does not have shikimori integration'
                });
            if (animeList.reqStatus === 500)
                return res.status(500).json({ message: "Server error" });
            const watchList = animeList;
            const shikimoriAnimeIds = watchList.map((anime) => anime.target_id);
            // Splice all ids into groups of 50, so we can batch request anime from shikimori
            //TODO: Rewrite this entirely to use kodik's api
            const kodik = new kodikapi_1.default();
            const awaitResult = shikimoriAnimeIds.flatMap((shikimori_id) => __awaiter(this, void 0, void 0, function* () {
                let response = yield kodik.getFullAnime(shikimori_id);
                if (response.reqStatus === 500)
                    return res.status(500).json({ message: "Server error" });
                return response;
            }));
            const result = yield Promise.all(awaitResult.flatMap((p) => __awaiter(this, void 0, void 0, function* () { return yield p; })));
            console.log(result);
            return;
            // if (res.headersSent) return;
            // const animeInList = await prisma.$transaction(
            //     result.map((anime) => {
            //         return prisma.anime.upsert({
            //             where: {
            //                 shikimori_id: anime.id,
            //             },
            //             create: {
            //                 current_episodes: anime.episodes_aired,
            //                 max_episodes: anime.episodes,
            //                 shikimori_id: anime.id,
            //                 english_name: anime.name,
            //                 status: anime.status,
            //                 image: anime.image.original,
            //                 name: anime.russian,
            //                 media_type: anime.kind,
            //                 shikimori_score: parseFloat(anime.score),
            //                 first_episode_aired: new Date(anime.aired_on),
            //                 last_episode_aired: new Date(anime.released_on),
            //             },
            //             update: {
            //                 current_episodes: anime.episodes_aired,
            //                 max_episodes: anime.episodes,
            //                 status: anime.status,
            //                 image: anime.image.original,
            //                 shikimori_score: parseFloat(anime.score),
            //                 first_episode_aired: new Date(anime.aired_on),
            //                 last_episode_aired: new Date(anime.released_on),
            //             }
            //         });
            //     })
            // );
            // for (let i = 0; i < watchList.length; i++) {
            //     const listEntry = watchList[i];
            //     const res = await prisma.anime_list.updateMany({
            //         where: {
            //             AND: {
            //                 user_id: id,
            //                 anime_id: animeInList.find((anime) => anime.shikimori_id == listEntry.target_id)!.id,
            //             }
            //         },
            //         data: {
            //             status: listEntry.status,
            //             watched_episodes: listEntry.episodes,
            //             rating: listEntry.score
            //         }
            //     });
            //     const { count } = res;
            //     if (count > 0) watchList.splice(i--, 1);
            // }
            // const animeCreateData = watchList.map((listEntry) => {
            //     return {
            //         is_favorite: false,
            //         status: listEntry.status,
            //         watched_episodes: listEntry.episodes,
            //         user_id: id,
            //         anime_id: animeInList.find((anime) => anime.shikimori_id == listEntry.target_id)!.id,
            //         rating: listEntry.score,
            //     }
            // })
            // await prisma.anime_list.createMany({
            //     data: animeCreateData
            // });
            // return res.json({
            //     message: 'List imported successfully'
            // });
        });
    }
    static addToList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(422).json({ errors: result.array() });
            }
            const { is_favorite, rating, status, watched_episodes } = req.body;
            const { id } = req.auth;
            let user;
            try {
                user = yield db_1.prisma.user.findFirstOrThrow({
                    where: { id },
                });
            }
            catch (error) {
                return res.status(403).json({ message: "unauthorized" });
            }
            const animeListEntry = yield db_1.prisma.anime_list.findFirst({
                where: {
                    AND: {
                        user_id: id,
                        anime_id: req.params.anime_id,
                    }
                }
            });
            if (animeListEntry)
                return res.status(400).json({
                    error: {
                        anime_id: "List entry with this anime already exists",
                    }
                });
            yield db_1.prisma.anime_list.create({
                data: {
                    is_favorite,
                    status,
                    watched_episodes,
                    rating,
                    anime_id: req.params.anime_id,
                    user_id: id
                }
            });
            const anime_list = yield db_1.prisma.anime_list.findMany({
                where: {
                    AND: {
                        user_id: id,
                        anime_id: req.params.anime_id,
                    }
                },
                include: {
                    anime: true
                }
            });
            return res.json({
                data: anime_list
            });
        });
    }
    static editList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty())
                return res.status(422).json({ errors: result.array() });
            const { is_favorite, rating, status, watched_episodes } = req.body;
            const { id } = req.auth;
            let user;
            try {
                user = yield db_1.prisma.user.findFirstOrThrow({
                    where: { id },
                });
            }
            catch (error) {
                return res.status(403).json({ message: "unauthorized" });
            }
            const animeListEntry = yield db_1.prisma.anime_list.findFirst({
                where: {
                    AND: {
                        user_id: id,
                        anime_id: req.params.anime_id,
                    }
                }
            });
            if (!animeListEntry)
                return res.status(400).json({
                    error: {
                        anime_id: "List entry with this anime doesn't exists",
                    }
                });
            yield db_1.prisma.anime_list.updateMany({
                where: { anime_id: req.params.anime_id },
                data: {
                    is_favorite,
                    status,
                    watched_episodes,
                    rating,
                }
            });
            const anime_list = yield db_1.prisma.anime_list.findMany({
                where: {
                    AND: {
                        user_id: id,
                        anime_id: req.params.anime_id,
                    }
                },
                include: {
                    anime: true
                }
            });
            return res.json({
                data: anime_list
            });
        });
    }
    static deleteFromList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.auth;
            let user;
            try {
                user = yield db_1.prisma.user.findFirstOrThrow({
                    where: { id },
                });
            }
            catch (error) {
                return res.status(403).json({ message: "unauthorized" });
            }
            const animeListEntry = yield db_1.prisma.anime_list.findFirst({
                where: {
                    AND: {
                        user_id: id,
                        anime_id: req.params.anime_id,
                    }
                }
            });
            if (!animeListEntry)
                return res.status(400).json({
                    error: {
                        anime_id: "List entry with this anime doesn't exists",
                    }
                });
            yield db_1.prisma.anime_list.deleteMany({
                where: { anime_id: req.params.anime_id },
            });
            return res.json({
                message: "Entry deleted successfuly"
            });
        });
    }
}
exports.default = WatchListController;
//# sourceMappingURL=WatchListController.js.map