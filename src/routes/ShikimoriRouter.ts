import { Router } from 'express';
import ShikimoriController from '../controllers/ShikimoriController';
import { wrap } from '../middleware/errorHandler';
import ShikimoriUnlinkRequest from '../requests/shikimoriLink/ShikimoriUnlinkRequest';
import GetShikimoriLinkRequest from '../requests/shikimoriLink/GetShikimoriLinkRequest';
import GetShikimoriProfileRequest from '../requests/shikimoriLink/GetShikimoriProfileRequest';
import ShikimoriLinkRequest from '../requests/shikimoriLink/ShikimoriLinkRequest';
const router = Router();

// Public methods
router.get("/link", new ShikimoriLinkRequest().send(), wrap(ShikimoriController.link));

// Private methods
router.get("/getlink", new GetShikimoriLinkRequest().send(), wrap(ShikimoriController.generateLink));
router.delete("/unlink", new ShikimoriUnlinkRequest().send(), wrap(ShikimoriController.unlink));
router.get("/profile", new GetShikimoriProfileRequest().send(), wrap(ShikimoriController.getProfile));
export { router as shikimoriRouter };