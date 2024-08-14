import { Router } from 'express';
import ShikimoriController from '@controllers/ShikimoriController';
import { wrap } from '@/middleware/errorHandler';
import { profileUserReq } from '@requests/ProfileUserRequest';
import { linkShikimoriReq } from '@requests/shikimori/LinkShikimoriRequest';

const router = Router();

router.get('/link', linkShikimoriReq, wrap(ShikimoriController.link));
router.get('/getlink', profileUserReq, wrap(ShikimoriController.generateLink));
router.get('/profile', profileUserReq, wrap(ShikimoriController.getProfile));
router.delete('/unlink', profileUserReq, wrap(ShikimoriController.unlink));

export { router as shikimoriRouter };
