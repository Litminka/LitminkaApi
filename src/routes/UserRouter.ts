import { Router } from 'express';
import UserController from "../controllers/UserController";
import { auth } from '../middleware/auth';
import { registrationValidation, loginValidation } from "../validators/UserValidator";
import { wrap } from '../middleware/errorHandler';
const router = Router();

router.get("/", wrap(UserController.getUsers));
router.post("/register", registrationValidation(), wrap(UserController.createUser));
router.post("/login", loginValidation(), wrap(UserController.loginUser));
router.get("/profile", auth, wrap(UserController.profile));
export { router as userRouter };