import { Router } from 'express';
import WatchListController from '../controllers/WatchListController';
import { auth } from '../middleware/auth';
import { addToWatchListValidation, editWatchListValidation, deleteFromWatchListValidation } from '../validators/WatchListValidator';
import { wrap } from '../middleware/errorHandler';
const router = Router();

router.get("/", auth, wrap(WatchListController.getWatchList));
router.post("/import", auth, wrap(WatchListController.importList));
router.post("/:anime_id", [...addToWatchListValidation(), auth], wrap(WatchListController.addToList));
router.patch("/:anime_id", [...editWatchListValidation(), auth], wrap(WatchListController.editList));
router.delete("/:anime_id", [...deleteFromWatchListValidation(), auth], wrap(WatchListController.deleteFromList));
export { router as watchListRouter };