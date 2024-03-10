import { Router } from 'express';
import { wrap } from '../middleware/errorHandler';
import {
    genresValidator,
    yearsValidator,
    seasonsValidator,
    periodValidator,
    nameValidator,
    episodeValidator,
    statusesValidator,
    rpaRatingsValidator,
    mediaTypesValidator
} from "../validators/FilterValidator";
import SearchController from '../controllers/SearchController';
const router = Router();

router.get("/anime",
    [
        ...
        genresValidator(),
        yearsValidator(),
        periodValidator(),
        seasonsValidator(),
        nameValidator(),
        episodeValidator(),
        statusesValidator(),
        rpaRatingsValidator(),
        mediaTypesValidator()
    ], wrap(SearchController.getAnime))

export { router as searchRouter }