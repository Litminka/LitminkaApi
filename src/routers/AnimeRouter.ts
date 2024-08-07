import { Router } from 'express';
import AnimeController from '@/http/controllers/AnimeController';
import { baseReq } from '@/http/requests/Request';
import { getAnimeReq } from '@requests/anime/GetAnimeRequest';
import { getTopAnimeReq } from '@requests/anime/GetTopAnimeRequest';
import { frontPageAnimeReq } from '@requests/anime/FrontPageAnimeRequest';
import GetSingleAnimeRequest from '@requests/anime/GetSingleAnimeRequest';
import { wrap } from '@/middleware/errorHandler';

const router = Router();

router.get('', getAnimeReq, wrap(AnimeController.getAnime));
router.get('/top', getTopAnimeReq, wrap(AnimeController.getTopAnime));
router.get('/genres', baseReq, wrap(AnimeController.getGenres));

router.get('/seasonal', frontPageAnimeReq, wrap(AnimeController.getSeasonal));
router.get('/seasonal/popular', frontPageAnimeReq, wrap(AnimeController.getPopularSeasonal));
router.get('/seasonal/announced', frontPageAnimeReq, wrap(AnimeController.getNextSeasonAnnounced));

router.get('/:slug', new GetSingleAnimeRequest().send(), wrap(AnimeController.getSingleAnime));
export { router as animeRouter };
