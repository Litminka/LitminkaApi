import { Router } from 'express';
import { wrap } from '@/middleware/errorHandler';
import AnimeController from '@controllers/anime/AnimeController';
import GetTopAnimeRequest from '@requests/anime/GetTopAnimeRequest';
import { GetAnimeRequest } from '@requests/anime/GetAnimeRequest';
import { GetSingleAnimeRequest } from '@requests/anime/GetSingleAnimeRequest';
import FrontPageAnimeRequest from '@requests/anime/FrontPageAnimeRequest';
import Request from '@requests/Request';
const router = Router();

router.get('', new GetAnimeRequest().send(), wrap(AnimeController.getAnime));
router.post('', new GetAnimeRequest().send(), wrap(AnimeController.getAnime));
router.get('/top', new GetTopAnimeRequest().send(), wrap(AnimeController.getTopAnime));
router.get('/genres', new Request().send(), wrap(AnimeController.getGenres));

router.get('/seasonal', new FrontPageAnimeRequest().send(), wrap(AnimeController.getSeasonal));
router.get(
    '/seasonal/popular',
    new FrontPageAnimeRequest().send(),
    wrap(AnimeController.getPopularSeasonal)
);
router.get(
    '/seasonal/announced',
    new FrontPageAnimeRequest().send(),
    wrap(AnimeController.getNextSeasonAnnounced)
);

router.get('/:slug', new GetSingleAnimeRequest().send(), wrap(AnimeController.getSingleAnime));
export { router as animeRouter };
