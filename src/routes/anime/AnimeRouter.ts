import { Router } from 'express';
import { wrap } from '../../middleware/errorHandler';
import AnimeRequest from '../../requests/AnimeRequest';
import AnimeController from '../../controllers/anime/AnimeController';
const router = Router();

router.get("/:animeId", new AnimeRequest().send(), wrap(AnimeController.getSingleAnime)
);
export { router as animeRouter };
