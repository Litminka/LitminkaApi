import { Router } from 'express';
import ShikimoriController from '../controllers/ShikimoriController';
import { auth } from '../middleware/auth';
const router = Router();

router.get("/getlink", auth, ShikimoriController.generateLink);
router.get("/link", ShikimoriController.link);
router.delete("/unlink", auth, ShikimoriController.unlink);
router.get("/profile", auth, ShikimoriController.getProfile);
export { router as shikimoriRouter };