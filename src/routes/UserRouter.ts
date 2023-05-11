import { Router } from 'express';
import UserController from "../controllers/UserController";
import { auth } from '../middleware/auth';
import { registrationValidation, loginValidation } from "../validators/UserValidator";
const router = Router();

router.get("/", UserController.getUsers);
router.post("/register", registrationValidation(), UserController.createUser);
router.post("/login", loginValidation(), UserController.loginUser);
router.get("/profile", auth, UserController.profile);
export { router as userRouter };