"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const UserController_1 = __importDefault(require("../controllers/UserController"));
const auth_1 = require("../middleware/auth");
const UserValidator_1 = require("../validators/UserValidator");
const router = (0, express_1.Router)();
exports.userRouter = router;
router.get("/", UserController_1.default.getUsers);
router.post("/signup", (0, UserValidator_1.registrationValidation)(), UserController_1.default.createUser);
router.post("/signin", (0, UserValidator_1.loginValidation)(), UserController_1.default.loginUser);
router.get("/profile", auth_1.auth, UserController_1.default.profile);
//# sourceMappingURL=UserRouter.js.map