import { Router } from 'express';
import UserController from '@controllers/UserController';
import { wrap } from '@/middleware/errorHandler';
import { registerUserReq } from '@requests/user/RegisterUserRequest';
import { loginUserReq } from '@requests/user/LoginUserRequest';
import { updateSettingsReq } from '@/http/requests/user/UpdateSettingsRequest';
import { profileUserReq } from '@/http/requests/ProfileUserRequest';

const router = Router();

router.post('/register', registerUserReq, wrap(UserController.create));
router.post('/login', loginUserReq, wrap(UserController.login));
router.get('/profile', profileUserReq, wrap(UserController.getProfile));
router.patch('/settings', updateSettingsReq, wrap(UserController.updateSettings));

export { router as userRouter };
