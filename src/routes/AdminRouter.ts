import { Router } from 'express';
import AnimeController from '@controllers/anime/AnimeController';
import { wrap } from '@/middleware/errorHandler';
import BanAnimeRequest from '@/requests/BanAnimeRequest';
const router = Router();

router.post("/anime/:animeId/ban", new BanAnimeRequest().send(), wrap(AnimeController.banAnime));
router.delete("/anime/:animeId/ban", new BanAnimeRequest().send(), wrap(AnimeController.unBanAnime));

export { router as adminRouter };
