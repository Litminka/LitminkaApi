import { Router } from 'express';
import FollowController from '@controllers/FollowController';
import { wrap } from '@/middleware/errorHandler';
import { followAnimeReq } from '@requests/anime/FollowAnimeRequest';
import { unFollowAnimeReq } from '@requests/anime/UnfollowAnimeRequest';

const router = Router();

router.post('/:animeId', followAnimeReq, wrap(FollowController.follow));
router.delete('/:animeId', unFollowAnimeReq, wrap(FollowController.unfollow));
export { router as followRouter };
