import { Router } from 'express';
import AnimeController from '../controllers/AnimeController';
import { wrap } from '../middleware/errorHandler';
import AnimeRequest from '../requests/AnimeRequest';
const router = Router();

router.get("/:animeId", new AnimeRequest().send(), wrap(AnimeController.getSingleAnime)
);
export { router as animeRouter };
