import { Router } from 'express';
import { wrap } from '@/middleware/errorHandler';
import AnimeSearchController from '@controllers/anime/AnimeSearchController';
import AnimeSearchRequest from '@requests/AnimeSearchRequest';

const router = Router();

router.get("/anime", new AnimeSearchRequest().send(), wrap(AnimeSearchController.getAnime))

export { router as animeSearchRouter }