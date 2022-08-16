import { Router } from 'express';
import { param } from 'express-validator';
import AnimeController from '../controllers/AnimeController';
import { auth } from '../middleware/auth';
import { optionalAuth } from '../middleware/optionalAuth';
const router = Router();

router.get("/:anime_id", [param("anime_id").notEmpty().isInt().bail().toInt(), optionalAuth], AnimeController.getSingleAnime);
export { router as animeRouter };