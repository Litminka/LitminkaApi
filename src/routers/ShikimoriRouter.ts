import { Router } from 'express';
import ShikimoriController from '@controllers/ShikimoriController';
import { wrap } from '@/middleware/errorHandler';
import { IntegrationRequest } from '@requests/IntegrationRequest';
import { LinkShikimoriRequest } from '@requests/shikimori/LinkShikimoriRequest';
const router = Router();

// Public methods
router.get("/link", new LinkShikimoriRequest().send(), wrap(ShikimoriController.link));

// Private methods
router.get("/getlink", new IntegrationRequest().send(), wrap(ShikimoriController.generateLink));
router.get("/profile", new IntegrationRequest().send(), wrap(ShikimoriController.getProfile));
router.delete("/unlink", new IntegrationRequest().send(), wrap(ShikimoriController.unlink));
export { router as shikimoriRouter };