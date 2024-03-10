import { Router } from 'express';
import { wrap } from '../middleware/errorHandler';
import SearchController from '../controllers/SearchController';
import SearchAnimeRequest from '../requests/SearchAnimeRequest';

const router = Router();

router.get("/anime", new SearchAnimeRequest().send(), wrap(SearchController.getAnime))

export { router as searchRouter }