import { Router } from 'express';
import AnimeController from '@controllers/AnimeController';
import { manageAnimeReq } from '@/http/requests/anime/ManageAnimeRequest';
import { wrap } from '@/middleware/errorHandler';

const router = Router();

router.post('/anime/:animeId/ban', manageAnimeReq, wrap(AnimeController.banAnime));
router.delete('/anime/:animeId/ban', manageAnimeReq, wrap(AnimeController.unBanAnime));

export { router as adminRouter };
