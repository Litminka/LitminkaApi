import { Router } from 'express';
import ShikimoriController from '../controllers/ShikimoriController';
import { auth } from '../middleware/auth';
import { wrap } from '../middleware/errorHandler';
const router = Router();

router.get("/link", wrap(ShikimoriController.link));
router.get("/getlink", auth, wrap(ShikimoriController.generateLink));
router.delete("/unlink", auth, wrap(ShikimoriController.unlink));
router.get("/profile", auth, wrap(ShikimoriController.getProfile));
export { router as shikimoriRouter };