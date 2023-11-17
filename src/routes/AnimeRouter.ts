import { Router } from 'express';
import { param } from 'express-validator';
import AnimeController from '../controllers/AnimeController';
import { auth } from '../middleware/auth';
import { optionalAuth } from '../middleware/optionalAuth';
import { validationNotFound } from '../middleware/validationNotFound';
const router = Router();

router.get("/:anime_id", [param("anime_id").notEmpty().isInt().bail().toInt(), optionalAuth, validationNotFound], AnimeController.getSingleAnime);
export { router as animeRouter };
