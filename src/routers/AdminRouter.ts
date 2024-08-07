import { Router } from 'express';
import AnimeController from '@/http/controllers/AnimeController';
import { banAnimeReq } from '@requests/anime/BanAnimeRequest';
import { wrap } from '@/middleware/errorHandler';

const router = Router();

router.post('/anime/:animeId/ban', banAnimeReq, wrap(AnimeController.banAnime));
router.delete('/anime/:animeId/ban', banAnimeReq, wrap(AnimeController.unBanAnime));

export { router as adminRouter };
