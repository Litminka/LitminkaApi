import { Router } from 'express';
import UserController from "../controllers/UserController";
import { wrap } from '../middleware/errorHandler';
import RegisterUserRequest from '../requests/user/RegisterUserRequest';
import LoginUserRequest from '../requests/user/LoginUserRequest';
import GetUserProfileRequest from '../requests/user/GetUserProfileRequest';
const router = Router();

// Public methods
router.post("/register", new RegisterUserRequest().send(), wrap(UserController.createUser));
router.post("/login", new LoginUserRequest().send(), wrap(UserController.loginUser));

// Private methods
router.get("/profile", new GetUserProfileRequest().send(), wrap(UserController.profile));
export { router as userRouter };