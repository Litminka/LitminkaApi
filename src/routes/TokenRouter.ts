import { Router } from 'express';
import TokenController from '@controllers/TokenController';
import { wrap } from '@/middleware/errorHandler';
import AuthRequest from '@requests/AuthRequest';
import EndSessionRequest from '@/requests/session/EndSessionRequest';
const router = Router();

router.get("/refresh", wrap(TokenController.refreshToken));

router.get('/', new AuthRequest().send(), wrap(TokenController.getTokens));
router.delete('/', new EndSessionRequest().send(), wrap(TokenController.deleteTokens));

export { router as tokenRouter };