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
const express_validator_1 = require("express-validator");
const db_1 = require("../db");
class FollowController {
    static follow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty())
                return res.status(422).json({ errors: result.array() });
            const { group_name } = req.body;
            const { id } = req.auth;
            const user = yield db_1.prisma.user.findFirst({ where: { id }, });
            if (!user)
                return res.status(403).json({ errors: "unathorized" });
            const anime_id = req.params.anime_id;
            let anime;
            try {
                anime = yield db_1.prisma.anime.findFirstOrThrow({
                    where: { id: anime_id },
                    include: {
                        anime_translations: {
                            include: {
                                group: true
                            }
                        }
                    }
                });
            }
            catch (error) {
                return res.status(404).json({ message: "This anime doesn't exist" });
            }
            const translations = anime.anime_translations.filter(anime => anime.group.name == group_name);
            if (translations.length == 0)
                return res.status(422).json({ error: "This anime doesn't have given group" });
            const [translation] = translations;
            yield db_1.prisma.user.update({
                where: { id },
                data: {
                    follows: {
                        create: {
                            status: "Follow",
                            anime_id: anime.id,
                            translation_id: translation.id,
                        }
                    }
                }
            });
            return res.status(200).json({
                message: "Anime followed successfuly"
            });
        });
    }
}
exports.default = FollowController;
//# sourceMappingURL=FollowController.js.map