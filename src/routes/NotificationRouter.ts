import { Router } from 'express';
import NotificationController from '../controllers/NotificationController';
import { auth } from '../middleware/auth';
import { wrap } from '../middleware/errorHandler';
import { softPeriodValidator } from '../validators/PeriodValidator';
import { validateArrayId, validateBool } from '../validators/BaseValidator';
const router = Router();

// Private methods
router.use(auth)
router.get("/user", [...softPeriodValidator("createdAt"), validateBool("isRead")], wrap(NotificationController.getUserNotifications))
router.get("", ...softPeriodValidator("createdAt"), wrap(NotificationController.getNotifications))
router.post("/read", ...validateArrayId("id"), wrap(NotificationController.readNotifications))

export { router as notificationRouter }