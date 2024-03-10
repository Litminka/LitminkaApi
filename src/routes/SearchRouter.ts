import { Router } from 'express';
import { wrap } from '../middleware/errorHandler';
import {
    genresValidator,
    yearsValidator,
    seasonsValidator,
    nameValidator,
    episodeValidator,
    statusesValidator,
    rpaRatingsValidator,
    mediaTypesValidator
} from "../validators/FilterValidator";
import { softPeriodValidator } from '../validators/PeriodValidator';
import SearchController from '../controllers/SearchController';

const router = Router();

router.get("/anime",
    [
        ...
        genresValidator("includeGenres"),
        genresValidator("excludeGenres"),
        yearsValidator(),
        softPeriodValidator("period"),
        seasonsValidator(),
        nameValidator(),
        episodeValidator(),
        statusesValidator(),
        rpaRatingsValidator(),
        mediaTypesValidator()
    ], wrap(SearchController.getAnime))

export { router as searchRouter }