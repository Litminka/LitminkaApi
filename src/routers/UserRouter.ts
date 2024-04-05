import { Router } from 'express';
import UserController from "@controllers/UserController";
import { wrap } from '@/middleware/errorHandler';
import { RegisterUserRequest } from '@requests/user/RegisterUserRequest';
import { LoginUserRequest } from '@requests/user/LoginUserRequest';
import { WithPermissionsRequest } from '@requests/WithPermissionsRequest';
const router = Router();

// Public methods
router.post("/register", new RegisterUserRequest().send(), wrap(UserController.createUser));
router.post("/login", new LoginUserRequest().send(), wrap(UserController.loginUser));

// Private methods
router.get("/profile", new WithPermissionsRequest().send(), wrap(UserController.profile));
export { router as userRouter };