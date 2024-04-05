import { Router } from 'express';
import { wrap } from '@/middleware/errorHandler';
import AnimeController from '@controllers/anime/AnimeController';
import GetTopAnimeRequest from '@/requests/anime/GetTopAnimeRequest';
import { GetAnimeRequest } from '@/requests/anime/GetAnimeRequest';
import { GetSingleAnimeRequest } from '@/requests/anime/GetSingleAnimeRequest';
const router = Router();

router.get("", new GetAnimeRequest().send(), wrap(AnimeController.getAnime));
router.get("/top", new GetTopAnimeRequest().send(), wrap(AnimeController.getTopAnime));
router.get("/:animeId", new GetSingleAnimeRequest().send(), wrap(AnimeController.getSingleAnime));
export { router as animeRouter };
