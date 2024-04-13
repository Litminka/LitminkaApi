import { Router } from 'express';
import WatchListController from '@controllers/WatchListController';
import { wrap } from '@/middleware/errorHandler';
import { AddToWatchListRequest } from '@requests/watchList/AddToWatchListRequest';
import { EditWatchListRequest } from '@requests/watchList/EditWatchListRequest';
import { DeleteFromWatchListRequest } from '@requests/watchList/DeleteFromWatchListRequest';
import { GetWatchListRequest } from '@requests/watchList/GetWatchListRequest';
import { IntegrationRequest } from '@requests/IntegrationRequest';
const router = Router();

// Private methods
router.get('/', new GetWatchListRequest().send(), wrap(WatchListController.get));
router.post('/import', new IntegrationRequest().send(), wrap(WatchListController.startImport));
router.post('/:animeId', new AddToWatchListRequest().send(), wrap(WatchListController.add));
router.patch('/:animeId', new EditWatchListRequest().send(), wrap(WatchListController.update));
router.delete(
    '/:animeId',
    new DeleteFromWatchListRequest().send(),
    wrap(WatchListController.delete)
);
export { router as watchListRouter };
