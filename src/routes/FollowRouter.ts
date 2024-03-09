import { Router } from 'express';
import FollowController from '../controllers/FollowController';
import { auth } from '../middleware/auth';
import { FollowValidation, UnFollowValidation } from '../validators/FollowValidator';
import { wrap } from '../middleware/errorHandler';
const router = Router();

// Private methods
router.use(auth)
router.post("/:anime_id", ...FollowValidation(), wrap(FollowController.follow));
router.delete("/:anime_id", ...UnFollowValidation(), wrap(FollowController.unfollow));
export { router as followRouter };