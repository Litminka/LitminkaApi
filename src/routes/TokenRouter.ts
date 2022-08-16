import { Router } from 'express';
import TokenController from '../controllers/TokenController';
const router = Router();

router.get("/refresh", TokenController.refreshToken);
export { router as tokenRouter };