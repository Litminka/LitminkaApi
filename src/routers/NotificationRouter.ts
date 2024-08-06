import { Router } from 'express';
import NotificationController from '@controllers/NotificationController';
import { wrap } from '@/middleware/errorHandler';
import { getNotificationsReq } from '@requests/notification/GetNotificationsRequest';
import { getUserNotificationsReq } from '@requests/notification/GetUserNotificationsRequest';
import { GetUserNotificationsCountReq } from '@requests/notification/GetUserNotificationsCountRequest';
import { readNotificationsReq } from '@requests/notification/ReadNotificationsRequest';

const router = Router();

router.get('', getNotificationsReq, wrap(NotificationController.getNotifications));
router.get('/user', getUserNotificationsReq, wrap(NotificationController.getUserNotifications));
router.get(
    '/user/count',
    GetUserNotificationsCountReq,
    wrap(NotificationController.getUserNotificationsCount)
);
router.post('/read', readNotificationsReq, wrap(NotificationController.readNotifications));

export { router as notificationRouter };
