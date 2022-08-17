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
const crypto_1 = __importDefault(require("crypto"));
const shikimoriapi_1 = __importDefault(require("../helper/shikimoriapi"));
const db_1 = require("../db");
class ShikimoriController {
    static generateLink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.auth;
            const token = crypto_1.default.randomBytes(24).toString('hex');
            yield db_1.prisma.shikimori_Link_Token.upsert({
                where: { user_id: id },
                update: {
                    token: token,
                },
                create: {
                    user_id: id,
                    token: token,
                }
            });
            const link = `https://api.litminka.ru/shikimori/link?token=${token}`;
            return res.status(200).json({
                link: `https://shikimori.one/oauth/authorize?client_id=${process.env.shikimori_client_id}&redirect_uri=${link}&response_type=code&scope=user_rates`
            });
        });
    }
    static link(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, code } = req.query;
            if (typeof token !== "string")
                return res.status(401).json({
                    message: "Query param token must be string",
                });
            if (typeof code !== "string")
                return res.status(401).json({
                    message: "Query param code must be string",
                });
            try {
                yield db_1.prisma.shikimori_Link_Token.update({
                    where: { token },
                    data: {
                        user: {
                            update: {
                                integration: {
                                    upsert: {
                                        create: {
                                            shikimori_code: code
                                        },
                                        update: {
                                            shikimori_code: code
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            }
            catch (error) {
                return res.status(401).json({
                    message: "Query param code must be string",
                });
            }
            let user;
            try {
                user = yield db_1.prisma.user.findFirstOrThrow({
                    where: {
                        shikimori_link: {
                            token
                        }
                    },
                    include: {
                        integration: true,
                        shikimori_link: true
                    }
                });
            }
            catch (error) {
                console.log(error);
                return res.status(403).json({
                    message: "User does not exist"
                });
            }
            const shikimoriapi = new shikimoriapi_1.default(user);
            const profile = yield shikimoriapi.getProfile();
            if (!profile)
                return res.status(401).json({
                    message: 'User does not have shikimori integration'
                });
            if (profile.reqStatus === 500)
                return res.status(500).json({ message: "Server error" });
            yield db_1.prisma.integration.update({
                where: {
                    user_id: user.id
                },
                data: {
                    shikimori_id: profile.id
                }
            });
            return res.status(200).json({
                message: "Account linked!"
            });
        });
    }
    static getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.auth;
            let user;
            try {
                user = yield db_1.prisma.user.findFirstOrThrow({
                    where: {
                        id
                    },
                    include: {
                        integration: true,
                        shikimori_link: true
                    },
                });
            }
            catch (error) {
                console.log(error);
                return res.status(403).json({
                    message: "User does not exist"
                });
            }
            const shikimori = new shikimoriapi_1.default(user);
            const result = yield shikimori.getProfile();
            if (!result)
                return res.status(401).json({
                    message: 'User does not have shikimori integration'
                });
            if (result.reqStatus === 500)
                return res.status(500).json({ message: "Server error" });
            result.avatar;
            return res.status(200).json(result);
        });
    }
}
exports.default = ShikimoriController;
//# sourceMappingURL=ShikimoriController.js.map