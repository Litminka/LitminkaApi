import { Router } from 'express';
import AnimeController from '@/http/controllers/AnimeController';
import { baseReq } from '@/http/requests/Request';
import { getAnimeReq } from '@requests/anime/GetAnimeRequest';
import { getPopularAnimeReq } from '@/http/requests/anime/GetPopularAnimeRequest';
import { frontPageAnimeReq } from '@requests/anime/FrontPageAnimeRequest';
import GetSingleAnimeRequest from '@requests/anime/GetSingleAnimeRequest';
import { wrap } from '@/middleware/errorHandler';

const router = Router();

router.get('', getAnimeReq, wrap(AnimeController.getAnime));
router.get('/top', getPopularAnimeReq, wrap(AnimeController.getTopAnime));
router.get('/genres', baseReq, wrap(AnimeController.getGenres));

router.get('/seasonal', frontPageAnimeReq, wrap(AnimeController.getSeasonal));
router.get('/seasonal/popular', getPopularAnimeReq, wrap(AnimeController.getPopularSeasonal));
router.get('/seasonal/announced', frontPageAnimeReq, wrap(AnimeController.getNextSeasonAnnounced));

router.get('/:slug', new GetSingleAnimeRequest().send(), wrap(AnimeController.getSingleAnime));
export { router as animeRouter };
