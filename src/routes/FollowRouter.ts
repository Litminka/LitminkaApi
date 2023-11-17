import { Router } from 'express';
import FollowController from '../controllers/FollowController';
import { auth } from '../middleware/auth';
import { FollowValidation, UnFollowValidation } from '../validators/FollowValidator';
import { validationError } from '../middleware/validationError';
const router = Router();

router.post("/:anime_id", [auth, ...FollowValidation(), validationError], FollowController.follow);
router.delete("/:anime_id", [auth, ...UnFollowValidation(), validationError], FollowController.unfollow);
export { router as followRouter };