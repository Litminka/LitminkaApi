import { Router } from 'express';
import TokenController from '@controllers/TokenController';
import { baseReq } from '@/http/requests/Request';
import { authReq } from '@requests/AuthRequest';
import { endSessionReq } from '@requests/session/EndSessionRequest';
import { wrap } from '@/middleware/errorHandler';

const router = Router();

router.get('/', authReq, wrap(TokenController.getTokens));
router.get('/refresh', baseReq, wrap(TokenController.refreshToken));
router.delete('/', endSessionReq, wrap(TokenController.deleteTokens));

export { router as tokenRouter };
