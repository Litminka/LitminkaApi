import { Router } from 'express';
import NotificationController from '../controllers/NotificationController';
import { auth } from '../middleware/auth';
import { wrap } from '../middleware/errorHandler';
import { PeriodValidator } from '../validators/PeriodValidator';
const router = Router();

router.get("/:user_id", [auth, ...PeriodValidator()], wrap(NotificationController.userNotifications))
router.get("", [auth, ...PeriodValidator()], wrap(NotificationController.globalNotifications))
router.post("/is_read", auth, wrap(NotificationController.notificationsIsRead))

export { router as notificationRouter }