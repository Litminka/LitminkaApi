import { Router } from 'express';
import { wrap } from '@/middleware/errorHandler';
import AnimeRequest from '@/requests/anime/AnimeRequest';
import GetTopAnimeRequest from '@/requests/anime/TopAnimeRequest';
import AnimeController from '@controllers/anime/AnimeController';
import AnimeSearchRequest from '@/requests/anime/SearchAnimeRequest';
import AnimeSearchController from '@/controllers/anime/AnimeSearchController';
const router = Router();

router.get("/top", new GetTopAnimeRequest().send(), wrap(AnimeController.getTopAnime));
router.get("/search", new AnimeSearchRequest().send(), wrap(AnimeSearchController.getAnime))
router.get("/:animeId", new AnimeRequest().send(), wrap(AnimeController.getSingleAnime));
export { router as animeRouter };
