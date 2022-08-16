import { Router } from 'express';
import FollowController from '../controllers/FollowController';
import { auth } from '../middleware/auth';
import { FollowValidation } from '../validators/FollowValidator';
const router = Router();

router.post("/:anime_id", [auth, ...FollowValidation()], FollowController.follow);
export { router as followRouter };