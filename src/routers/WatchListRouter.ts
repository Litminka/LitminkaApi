import { Router } from 'express';
import WatchListController from '@controllers/WatchListController';
import { wrap } from '@/middleware/errorHandler';
import { editWatchListReq } from '@requests/watchList/EditWatchListRequest';
import { deleteFromWatchListReq } from '@requests/watchList/DeleteFromWatchListRequest';
import { getWatchListReq } from '@requests/watchList/GetWatchListRequest';
import { integrationReq } from '@requests/ProfileUserRequest';

const router = Router();

router.get('/', getWatchListReq, wrap(WatchListController.get));
router.post('/import', integrationReq, wrap(WatchListController.startImport));
router.post('/:animeId', editWatchListReq, wrap(WatchListController.edit));
router.delete('/:animeId', deleteFromWatchListReq, wrap(WatchListController.delete));

export { router as watchListRouter };
