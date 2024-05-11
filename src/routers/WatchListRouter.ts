import { Router } from 'express';
import WatchListController from '@controllers/WatchListController';
import { wrap } from '@/middleware/errorHandler';
import { addToWatchListReq } from '@requests/watchList/AddToWatchListRequest';
import { editWatchListReq } from '@requests/watchList/EditWatchListRequest';
import { deleteFromWatchListReq } from '@requests/watchList/DeleteFromWatchListRequest';
import { getWatchListReq } from '@requests/watchList/GetWatchListRequest';
import { integrationReq } from '@requests/IntegrationRequest';

const router = Router();

router.get('/', getWatchListReq, wrap(WatchListController.get));
router.post('/import', integrationReq, wrap(WatchListController.startImport));
router.post('/:animeId', addToWatchListReq, wrap(WatchListController.add));
router.patch('/:animeId', editWatchListReq, wrap(WatchListController.update));
router.delete('/:animeId', deleteFromWatchListReq, wrap(WatchListController.delete));

export { router as watchListRouter };
