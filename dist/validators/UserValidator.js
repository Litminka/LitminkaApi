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
exports.loginValidation = exports.registrationValidation = void 0;
const db_1 = require("../db");
const express_validator_1 = require("express-validator");
const registrationValidation = () => {
    return [
        (0, express_validator_1.body)("login").notEmpty().bail().custom((value) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield db_1.prisma.user.findFirst({
                where: { login: value }
            });
            if (user)
                throw new Error("Login is taken!");
            return true;
        })),
        (0, express_validator_1.body)("email").isEmail().bail().custom((value) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield db_1.prisma.user.findFirst({
                where: { email: value }
            });
            if (user)
                throw new Error("Email is taken!");
            return true;
        })).normalizeEmail(),
        (0, express_validator_1.body)("name").optional().isLength({ min: 4 }),
        (0, express_validator_1.body)("password").isLength({ min: 5 }),
        (0, express_validator_1.body)("passwordConfirm").custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
    ];
};
exports.registrationValidation = registrationValidation;
const loginValidation = () => {
    return [
        (0, express_validator_1.body)("login").notEmpty().isString(),
        (0, express_validator_1.body)("password").notEmpty().isString(),
    ];
};
exports.loginValidation = loginValidation;
//# sourceMappingURL=UserValidator.js.map