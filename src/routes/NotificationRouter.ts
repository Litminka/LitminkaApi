import { Router } from 'express';
import NotificationController from '../controllers/NotificationController';
import { auth } from '../middleware/auth';
import { wrap } from '../middleware/errorHandler';
import { softPeriodValidator } from '../validators/PeriodValidator';
import { validateBodyArrayId, validateBodyBool } from '../validators/BaseValidator';
const router = Router();

// Private methods
router.use(auth)
router.get("/user", [...softPeriodValidator("createdAt"), validateBodyBool("isRead")], wrap(NotificationController.getUserNotifications))
router.get("", ...softPeriodValidator("createdAt"), wrap(NotificationController.getNotifications))
router.post("/read", ...validateBodyArrayId("id"), wrap(NotificationController.readNotifications))

export { router as notificationRouter }