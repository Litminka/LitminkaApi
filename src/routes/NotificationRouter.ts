import { Router } from 'express';
import NotificationController from '@controllers/NotificationController';
import { wrap } from '@/middleware/errorHandler';
import { GetUserNotificationsRequest, GetNotificationsRequest, ReadNotificationsRequest } from '@requests/NotificationRequests';
const router = Router();

// Private methods
router.get("/user", new GetUserNotificationsRequest().send(), wrap(NotificationController.getUserNotifications))
router.get("", new GetNotificationsRequest().send(), wrap(NotificationController.getNotifications))
router.post("/read", new ReadNotificationsRequest().send(), wrap(NotificationController.readNotifications))

export { router as notificationRouter } 