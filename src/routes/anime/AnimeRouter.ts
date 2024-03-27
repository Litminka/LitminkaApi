import { Router } from 'express';
import { wrap } from '@/middleware/errorHandler';
import AnimeRequest from '@requests/AnimeRequest';
import GetTopAnimeRequest from '@/requests/GetTopAnimeRequest';
import AnimeController from '@controllers/anime/AnimeController';
import AnimeSearchRequest from '@/requests/AnimeSearchRequest';
import AnimeSearchController from '@/controllers/anime/AnimeSearchController';
const router = Router();

router.get("/top", new GetTopAnimeRequest().send(), wrap(AnimeController.getTopAnime));
router.get("/search", new AnimeSearchRequest().send(), wrap(AnimeSearchController.getAnime))
router.get("/:animeId", new AnimeRequest().send(), wrap(AnimeController.getSingleAnime));
export { router as animeRouter };
