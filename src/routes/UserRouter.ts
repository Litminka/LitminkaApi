import { Router } from 'express';
import UserController from "../controllers/UserController";
import { auth } from '../middleware/auth';
import { registrationValidation, loginValidation } from "../validators/UserValidator";
import { validationError } from '../middleware/validationError';
const router = Router();

router.use(validationError);
router.get("/", UserController.getUsers);
router.post("/register", [...registrationValidation(), validationError], UserController.createUser);
router.post("/login", [...loginValidation(), validationError], UserController.loginUser);
router.get("/profile", auth, UserController.profile);
export { router as userRouter };