"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenRouter = void 0;
const express_1 = require("express");
const TokenController_1 = __importDefault(require("../controllers/TokenController"));
const router = (0, express_1.Router)();
exports.tokenRouter = router;
router.get("/refresh", TokenController_1.default.refreshToken);
//# sourceMappingURL=TokenRouter.js.map