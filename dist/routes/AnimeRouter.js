"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.animeRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const AnimeController_1 = __importDefault(require("../controllers/AnimeController"));
const optionalAuth_1 = require("../middleware/optionalAuth");
const router = (0, express_1.Router)();
exports.animeRouter = router;
router.get("/:anime_id", [(0, express_validator_1.param)("anime_id").notEmpty().isInt().bail().toInt(), optionalAuth_1.optionalAuth], AnimeController_1.default.getSingleAnime);
//# sourceMappingURL=AnimeRouter.js.map