import { Router } from 'express';
import TokenController from '@controllers/TokenController';
import { wrap } from '@/middleware/errorHandler';
const router = Router();

router.get("/refresh", wrap(TokenController.refreshToken));
export { router as tokenRouter };