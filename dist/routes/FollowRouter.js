"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.followRouter = void 0;
const express_1 = require("express");
const FollowController_1 = __importDefault(require("../controllers/FollowController"));
const auth_1 = require("../middleware/auth");
const FollowValidator_1 = require("../validators/FollowValidator");
const router = (0, express_1.Router)();
exports.followRouter = router;
router.post("/:anime_id", [auth_1.auth, ...(0, FollowValidator_1.FollowValidation)()], FollowController_1.default.follow);
//# sourceMappingURL=FollowRouter.js.map