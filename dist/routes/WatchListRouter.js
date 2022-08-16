"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchListRouter = void 0;
const express_1 = require("express");
const WatchListController_1 = __importDefault(require("../controllers/WatchListController"));
const auth_1 = require("../middleware/auth");
const WatchListValidator_1 = require("../validators/WatchListValidator");
const router = (0, express_1.Router)();
exports.watchListRouter = router;
router.get("/", auth_1.auth, WatchListController_1.default.getWatchList);
router.post("/import", auth_1.auth, WatchListController_1.default.importList);
router.post("/:anime_id", [...(0, WatchListValidator_1.addToWatchListValidation)(), auth_1.auth], WatchListController_1.default.addToList);
router.patch("/:anime_id", [...(0, WatchListValidator_1.editWatchListValidation)(), auth_1.auth], WatchListController_1.default.editList);
router.delete("/:anime_id", [...(0, WatchListValidator_1.deleteFromWatchListValidation)(), auth_1.auth], WatchListController_1.default.deleteFromList);
//# sourceMappingURL=WatchListRouter.js.map