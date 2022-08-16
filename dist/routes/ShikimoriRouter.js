"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shikimoriRouter = void 0;
const express_1 = require("express");
const ShikimoriController_1 = __importDefault(require("../controllers/ShikimoriController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.shikimoriRouter = router;
router.get("/getlink", auth_1.auth, ShikimoriController_1.default.generateLink);
router.get("/link", ShikimoriController_1.default.link);
router.get("/profile", auth_1.auth, ShikimoriController_1.default.getProfile);
//# sourceMappingURL=ShikimoriRouter.js.map