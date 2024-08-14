import { Router } from 'express';
import ShikimoriController from '@controllers/ShikimoriController';
import { wrap } from '@/middleware/errorHandler';
import { integrationReq } from '@requests/ProfileUserRequest';
import { linkShikimoriReq } from '@requests/shikimori/LinkShikimoriRequest';

const router = Router();

router.get('/link', linkShikimoriReq, wrap(ShikimoriController.link));
router.get('/getlink', integrationReq, wrap(ShikimoriController.generateLink));
router.get('/profile', integrationReq, wrap(ShikimoriController.getProfile));
router.delete('/unlink', integrationReq, wrap(ShikimoriController.unlink));

export { router as shikimoriRouter };
