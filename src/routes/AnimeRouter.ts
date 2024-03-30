import { Router } from 'express';
import { wrap } from '@/middleware/errorHandler';
import AnimeController from '@controllers/anime/AnimeController';
import GetTopAnimeRequest from '@/requests/anime/TopAnimeRequest';
import AnimeSearchRequest from '@/requests/anime/SearchAnimeRequest';
import AnimeRequest from '@/requests/anime/AnimeRequest';
const router = Router();

router.get("/top", new GetTopAnimeRequest().send(), wrap(AnimeController.getTopAnime));
router.get("/search", new AnimeSearchRequest().send(), wrap(AnimeController.getAnime))
router.get("/:animeId", new AnimeRequest().send(), wrap(AnimeController.getSingleAnime));
export { router as animeRouter };
