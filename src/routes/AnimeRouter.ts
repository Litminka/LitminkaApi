import { Router } from 'express';
import { param } from 'express-validator';
import AnimeController from '../controllers/AnimeController';
import { optionalAuth } from '../middleware/optionalAuth';
import { validationNotFound } from '../middleware/validationNotFound';
import { wrap } from '../middleware/errorHandler';
const router = Router();

router.get("/:anime_id",
    [param("anime_id").notEmpty().isInt().bail().toInt(), optionalAuth, validationNotFound],
    wrap(AnimeController.getSingleAnime)
);
export { router as animeRouter };
