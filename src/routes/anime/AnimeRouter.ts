import { Router } from 'express';
import AnimeController from '../../controllers/anime/AnimeController';
import { optionalAuth } from '../../middleware/optionalAuth';
import { validationNotFound } from '../../middleware/validationNotFound';
import { wrap } from '../../middleware/errorHandler';
import { validateParamId } from '../../validators/BaseValidator';
const router = Router();

router.get("/:animeId", [validateParamId('animeId'), optionalAuth, validationNotFound], wrap(AnimeController.getSingleAnime)
);
export { router as animeRouter };
