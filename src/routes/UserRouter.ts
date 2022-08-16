import { Router } from 'express';
import UserController from "../controllers/UserController";
import { auth } from '../middleware/auth';
import { registrationValidation, loginValidation } from "../validators/UserValidator";
const router = Router();

router.get("/", UserController.getUsers);
router.post("/signup", registrationValidation(), UserController.createUser);
router.post("/signin", loginValidation(), UserController.loginUser);
router.get("/profile", auth, UserController.profile);
export { router as userRouter };