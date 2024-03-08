import { Router } from 'express';
import NotificationController from '../controllers/NotificationController';
import { auth } from '../middleware/auth';
import { wrap } from '../middleware/errorHandler';
import { PeriodValidator } from '../validators/PeriodValidator';
import { validateArrayId } from '../validators/baseValidator';

const router = Router();

router.get("/user", [auth, ...PeriodValidator()], wrap(NotificationController.getUserNotifications))
router.get("", [auth, ...PeriodValidator()], wrap(NotificationController.getNotifications))
router.post("/read", [auth, ...validateArrayId('id')], wrap(NotificationController.readNotifications))

export { router as notificationRouter }