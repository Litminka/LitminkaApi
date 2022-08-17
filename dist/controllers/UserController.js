"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const encrypt_1 = require("../helper/encrypt");
const jwt = __importStar(require("jsonwebtoken"));
class UserController {
    static createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(422).json({ errors: result.array() });
            }
            const { email, login, password, name } = req.body;
            yield db_1.prisma.user.create({
                data: {
                    email,
                    login,
                    password: yield encrypt_1.Encrypt.cryptPassword(password),
                    name,
                    role: {
                        connectOrCreate: {
                            where: {
                                name: "user"
                            },
                            create: {
                                name: "user"
                            }
                        }
                    }
                }
            });
            return res.json({
                data: {
                    message: "User created successfuly"
                }
            });
        });
    }
    static loginUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = (0, express_validator_1.validationResult)(req);
            if (!result.isEmpty()) {
                return res.status(422).json({ errors: result.array() });
            }
            const { login, password } = req.body;
            const user = yield db_1.prisma.user.findFirst({
                select: {
                    id: true,
                    password: true,
                },
                where: {
                    OR: [
                        { login: { equals: login } },
                        { email: { equals: login } }
                    ]
                }
            });
            if (!user)
                return res.status(401).json({
                    data: {
                        error: "Login or password incorrect",
                    }
                });
            if (!(yield encrypt_1.Encrypt.comparePassword(password, user.password)))
                return res.status(401).json({
                    data: {
                        error: "Login or password incorrect",
                    }
                });
            const { id } = user;
            console.log(id);
            const token = jwt.sign({ id }, process.env.tokenSecret, { expiresIn: process.env.tokenLife });
            const refreshToken = jwt.sign({ id }, process.env.tokenRefreshSecret, { expiresIn: process.env.tokenRefreshLife });
            yield db_1.prisma.refreshToken.create({
                data: {
                    token: refreshToken,
                    user_id: id
                }
            });
            return res.status(200).json({
                data: {
                    message: "You've successfuly logged in",
                    token,
                    refreshToken
                }
            });
        });
    }
    // FIXME: Remove this debug method
    static getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield db_1.prisma.user.findMany({
                select: {
                    login: true,
                    name: true,
                    role: {
                        select: {
                            name: true,
                            permissions: {
                                select: {
                                    name: true,
                                }
                            }
                        }
                    }
                }
            });
            return res.json({
                users
            });
        });
    }
    static profile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.auth;
            const user = yield db_1.prisma.user.findFirst({
                where: {
                    id
                },
                include: {
                    role: {
                        include: {
                            permissions: true
                        }
                    }
                },
            });
            // FIXME: Remove sensitive data from this
            if (!user)
                return res.status(403).json({
                    data: {
                        message: "Unauthorized",
                    }
                });
            return res.status(200).json({
                data: {
                    message: `Welcome! ${user.login}`,
                    user
                }
            });
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=UserController.js.map