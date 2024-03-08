import { Router } from 'express';
import ShikimoriController from '../controllers/ShikimoriController';
import { auth } from '../middleware/auth';
import { wrap } from '../middleware/errorHandler';
const router = Router();

// Public methods
router.get("/link", wrap(ShikimoriController.link));

// Private methods
router.use(auth)
router.get("/getlink", wrap(ShikimoriController.generateLink));
router.delete("/unlink", wrap(ShikimoriController.unlink));
router.get("/profile", wrap(ShikimoriController.getProfile));
export { router as shikimoriRouter };