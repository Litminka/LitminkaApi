import { Router } from 'express';
import NotificationController from '../controllers/NotificationController';
import { wrap } from '../middleware/errorHandler';
import GetUserNotificationsRequest from '../requests/notifications/GetUserNotificationsRequest';
import GetNotificationsRequest from '../requests/notifications/GetNotificationsRequest';
import ReadNotificationsRequest from '../requests/notifications/ReadNotificationsRequest';
const router = Router();

// Private methods
router.get("/user", new GetUserNotificationsRequest().send(), wrap(NotificationController.getUserNotifications))
router.get("", new GetNotificationsRequest().send(), wrap(NotificationController.getNotifications))
router.post("/read", new ReadNotificationsRequest().send(), wrap(NotificationController.readNotifications))

export { router as notificationRouter } 