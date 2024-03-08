import { Router } from 'express';
import UserController from "../controllers/UserController";
import { auth } from '../middleware/auth';
import { registrationValidation, loginValidation } from "../validators/UserValidator";
import { wrap } from '../middleware/errorHandler';
const router = Router();

// Public methods
router.get("/", wrap(UserController.getUsers));
router.post("/register", registrationValidation(), wrap(UserController.createUser));
router.post("/login", loginValidation(), wrap(UserController.loginUser));

// Private methods
router.use(auth)
router.get("/profile", wrap(UserController.profile));
export { router as userRouter };