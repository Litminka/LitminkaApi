import { Router } from 'express';
import FollowController from '@controllers/FollowController';
import { wrap } from '@/middleware/errorHandler';
import FollowAnimeRequest from '@/requests/anime/FollowAnimeRequest';
import UnFollowAnimeRequest from '@/requests/anime/UnfollowAnimeRequest';
const router = Router();

router.post("/:animeId", new FollowAnimeRequest().send(), wrap(FollowController.follow));
router.delete("/:animeId", new UnFollowAnimeRequest().send(), wrap(FollowController.unfollow));
export { router as followRouter };