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
const groupsplice_1 = __importDefault(require("../helper/groupsplice"));
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
                        anime_list: {
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
            return res.json(user.anime_list);
        });
    }
    static importList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get current user
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
            console.log("Got list");
            const watchList = animeList;
            const shikimoriAnimeIds = watchList.map((anime) => anime.target_id);
            // Get all animes from kodik
            const kodik = new kodikapi_1.default();
            const awaitResult = shikimoriAnimeIds.flatMap((shikimori_id) => __awaiter(this, void 0, void 0, function* () {
                let response = yield kodik.getFullAnime(shikimori_id);
                if (response.reqStatus === 500)
                    return res.status(500).json({ message: "Server error" });
                return response;
            }));
            let result = yield Promise.all(awaitResult.flatMap((p) => __awaiter(this, void 0, void 0, function* () { return yield p; })));
            if (res.headersSent)
                return;
            console.log("Got anime from kodik");
            // Isolate all results that returned nothing
            const noResult = result.filter(result => result.results.length == 0);
            const noResultIds = noResult.map(result => result.shikimori_request);
            result = result.filter(result => result.results.length > 0);
            // Request all isolated ids from shikimori
            // Splice all ids into groups of 50, so we can batch request anime from shikimori
            const idsSpliced = (0, groupsplice_1.default)(noResultIds, 50);
            const shikimoriRes = idsSpliced.flatMap((batch) => __awaiter(this, void 0, void 0, function* () {
                let response = yield shikimoriapi.getBatchAnime(batch);
                if (response.reqStatus === 500)
                    return res.status(500).json({ message: "Server error" });
                return response;
            }));
            let noResultAnime = yield Promise.all(shikimoriRes.flatMap((p) => __awaiter(this, void 0, void 0, function* () { return yield p; })));
            noResultAnime = noResultAnime.flat();
            if (res.headersSent)
                return;
            console.log("Got anime from shikimori");
            // Form unique genres from all collected data
            const genres = result.flatMap(kodikresult => {
                return kodikresult.results.map(result => result.translation);
            });
            const genresUnique = [];
            genres.filter(function (item) {
                var i = genresUnique.findIndex(x => (x.id == item.id));
                if (i <= -1)
                    genresUnique.push(item);
                return null;
            });
            // Insert all unique genres
            yield db_1.prisma.$transaction(genresUnique.map(genre => {
                return db_1.prisma.group.upsert({
                    where: { id: genre.id },
                    create: {
                        id: genre.id,
                        name: genre.title,
                        type: genre.type
                    },
                    update: {}
                });
            }));
            // Insert kodik anime
            let animeInList = yield db_1.prisma.$transaction(result.map((record) => {
                const { results } = record;
                const [anime] = results;
                const { material_data } = anime;
                return db_1.prisma.anime.upsert({
                    where: {
                        shikimori_id: parseInt(anime.shikimori_id),
                    },
                    create: {
                        current_episodes: material_data.episodes_aired,
                        max_episodes: material_data.episodes_total,
                        shikimori_id: parseInt(anime.shikimori_id),
                        english_name: material_data.title_en,
                        status: material_data.anime_status,
                        image: material_data.poster_url,
                        name: material_data.anime_title,
                        media_type: material_data.anime_kind,
                        shikimori_score: material_data.shikimori_rating,
                        first_episode_aired: new Date(material_data.aired_at),
                        kodik_link: anime.link,
                        rpa_rating: material_data.rating_mpaa,
                        description: material_data.anime_description,
                        last_episode_aired: material_data.released_at ? new Date(material_data.released_at) : null,
                        anime_translations: {
                            createMany: {
                                data: results.map(anime => {
                                    var _a;
                                    return {
                                        group_id: anime.translation.id,
                                        current_episodes: (_a = anime.episodes_count) !== null && _a !== void 0 ? _a : 0
                                    };
                                })
                            }
                        },
                        genres: {
                            connectOrCreate: material_data.anime_genres.map(genre => {
                                return {
                                    where: {
                                        name: genre
                                    },
                                    create: {
                                        name: genre
                                    }
                                };
                            })
                        }
                    },
                    update: {
                        current_episodes: material_data.episodes_aired,
                        max_episodes: material_data.episodes_total,
                        status: material_data.anime_status,
                        image: material_data.poster_url,
                        shikimori_score: material_data.shikimori_rating,
                        first_episode_aired: new Date(material_data.aired_at),
                        last_episode_aired: material_data.released_at ? new Date(material_data.released_at) : null
                    }
                });
            }));
            // Insert shikimori anime
            const shikimoriUpdate = yield db_1.prisma.$transaction(noResultAnime.map((anime) => {
                return db_1.prisma.anime.upsert({
                    where: {
                        shikimori_id: anime.id,
                    },
                    create: {
                        current_episodes: anime.episodes_aired,
                        max_episodes: anime.episodes,
                        shikimori_id: anime.id,
                        english_name: anime.name,
                        status: anime.status,
                        image: anime.image.original,
                        name: anime.russian,
                        media_type: anime.kind,
                        shikimori_score: parseFloat(anime.score),
                        first_episode_aired: new Date(anime.aired_on),
                        last_episode_aired: new Date(anime.released_on),
                    },
                    update: {
                        current_episodes: anime.episodes_aired,
                        max_episodes: anime.episodes,
                        status: anime.status,
                        image: anime.image.original,
                        shikimori_score: parseFloat(anime.score),
                        first_episode_aired: new Date(anime.aired_on),
                        last_episode_aired: new Date(anime.released_on),
                    }
                });
            }));
            animeInList = animeInList.concat(shikimoriUpdate);
            console.log("anime updated");
            for (let i = 0; i < watchList.length; i++) {
                const listEntry = watchList[i];
                const res = yield db_1.prisma.anime_list.updateMany({
                    where: {
                        AND: {
                            user_id: id,
                            anime_id: animeInList.find((anime) => anime.shikimori_id == listEntry.target_id).id,
                        }
                    },
                    data: {
                        status: listEntry.status,
                        watched_episodes: listEntry.episodes,
                        rating: listEntry.score
                    }
                });
                // if were updated, remove from watchlist
                // prisma does not have upsert many, so we remove updated titles
                const { count } = res;
                if (count > 0)
                    watchList.splice(i--, 1);
            }
            yield db_1.prisma.anime_list.createMany({
                data: watchList.map((listEntry) => {
                    return {
                        is_favorite: false,
                        status: listEntry.status,
                        watched_episodes: listEntry.episodes,
                        user_id: id,
                        anime_id: animeInList.find((anime) => anime.shikimori_id == listEntry.target_id).id,
                        rating: listEntry.score,
                    };
                })
            });
            console.log("watchlist imported");
            return res.json({
                message: 'List imported successfully'
            });
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