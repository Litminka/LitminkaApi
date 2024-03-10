import { Router } from 'express';
import FollowController from '../controllers/FollowController';
import { auth } from '../middleware/auth';
import { FollowValidation, UnFollowValidation } from '../validators/FollowValidator';
import { wrap } from '../middleware/errorHandler';
import FollowAnimeRequest from '../requests/FollowAnimeRequest';
const router = Router();

router.post("/:animeId", new FollowAnimeRequest().send(), wrap(FollowController.follow));
router.delete("/:animeId", ...UnFollowValidation(), wrap(FollowController.unfollow));
export { router as followRouter };