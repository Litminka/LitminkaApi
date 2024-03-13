import { Router } from 'express';
import { wrap } from '../../middleware/errorHandler';
import SearchController from '../../controllers/anime/AnimeSearchController';
import SearchAnimeRequest from '../../requests/AnimeSearchRequest';

const router = Router();

router.get("/anime", new SearchAnimeRequest().send(), wrap(SearchController.getAnime))

export { router as searchRouter }