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
router.get('/', new GetWatchListRequest().send(), wrap(WatchListController.getWatchList));
router.post('/import', new IntegrationRequest().send(), wrap(WatchListController.importList));
router.post('/:animeId', new AddToWatchListRequest().send(), wrap(WatchListController.addToList));
router.patch('/:animeId', new EditWatchListRequest().send(), wrap(WatchListController.editList));
router.delete(
    '/:animeId',
    new DeleteFromWatchListRequest().send(),
    wrap(WatchListController.deleteFromList)
);
export { router as watchListRouter };
