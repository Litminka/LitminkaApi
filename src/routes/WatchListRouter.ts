import { Router } from 'express';
import WatchListController from '../controllers/WatchListController';
import { auth } from '../middleware/auth';
import { addToWatchListValidation, editWatchListValidation, deleteFromWatchListValidation } from '../validators/WatchListValidator';
const router = Router();

router.get("/", auth, WatchListController.getWatchList);
router.post("/import", auth, WatchListController.importList);
router.post("/:anime_id", [...addToWatchListValidation(), auth], WatchListController.addToList);
router.patch("/:anime_id", [...editWatchListValidation(), auth], WatchListController.editList);
router.delete("/:anime_id", [...deleteFromWatchListValidation(), auth], WatchListController.deleteFromList);
export { router as watchListRouter };