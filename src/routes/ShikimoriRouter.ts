import { Router } from 'express';
import ShikimoriController from '@controllers/ShikimoriController';
import { wrap } from '@/middleware/errorHandler';
import UnlinkShikimoriRequest from '@requests/shikimori/UnlinkShikimoriRequest';
import BaseShikimoriRequest from '@requests/shikimori/BaseShikimoriRequest';
import LinkShikimoriRequest from '@requests/shikimori/LinkShikimoriRequest';
const router = Router();

// Public methods
router.get("/link", new LinkShikimoriRequest().send(), wrap(ShikimoriController.link));

// Private methods
router.get("/getlink", new BaseShikimoriRequest().send(), wrap(ShikimoriController.generateLink));
router.get("/profile", new BaseShikimoriRequest().send(), wrap(ShikimoriController.getProfile));
router.delete("/unlink", new UnlinkShikimoriRequest().send(), wrap(ShikimoriController.unlink));
export { router as shikimoriRouter };