import { Router } from 'express';
import WatchListController from '../controllers/WatchListController';
import { auth } from '../middleware/auth';
import { addToWatchListValidation, editWatchListValidation, deleteFromWatchListValidation } from '../validators/WatchListValidator';
import { wrap } from '../middleware/errorHandler';
const router = Router();

// Private methods
router.use(auth)
router.get("/", wrap(WatchListController.getWatchList));
router.post("/import", wrap(WatchListController.importList));
router.post("/:animeId", ...addToWatchListValidation(), wrap(WatchListController.addToList));
router.patch("/:animeId", ...editWatchListValidation(), wrap(WatchListController.editList));
router.delete("/:animeId", ...deleteFromWatchListValidation(), wrap(WatchListController.deleteFromList));
export { router as watchListRouter };