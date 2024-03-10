import { Router } from 'express';
import NotificationController from '../controllers/NotificationController';
import { auth } from '../middleware/auth';
import { wrap } from '../middleware/errorHandler';
import { periodValidator } from '../validators/PeriodValidator';
import { validateArrayId, validateBool } from '../validators/BaseValidator';
const router = Router();

// Private methods
router.use(auth)
router.get("/user", [...periodValidator(), validateBool('is_read')], wrap(NotificationController.getUserNotifications))
router.get("", ...periodValidator(), wrap(NotificationController.getNotifications))
router.post("/read", ...validateArrayId('id'), wrap(NotificationController.readNotifications))

export { router as notificationRouter }