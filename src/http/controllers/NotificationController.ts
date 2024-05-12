import { Response } from 'express';
import Period from '@/helper/period';
import NotificationService from '@services/NotificationService';
import { RequestStatuses } from '@enums';
import GetUserNotificationsRequest from '@requests/notification/GetUserNotificationsRequest';
import GetNotificationsRequest from '@requests/notification/GetNotificationsRequest';
import ReadNotificationsRequest from '@requests/notification/ReadNotificationsRequest';

export default class NotificationController {
    public static async getUserNotifications(req: GetUserNotificationsRequest, res: Response) {
        const userId = req.user.id;
        const isRead = req.body.isRead;
        const period = req.body.period;

        const notifications = await NotificationService.getUserNotifications({
            isRead,
            userId,
            period
        });

        return res.status(RequestStatuses.OK).json({ body: notifications });
    }

    public static async getNotifications(req: GetNotificationsRequest, res: Response) {
        const period = req.body.period;

        const notifications = await NotificationService.getNotifications(Period.getPeriod(period));

        return res.status(RequestStatuses.OK).json({ body: notifications });
    }

    public static async readNotifications(req: ReadNotificationsRequest, res: Response) {
        const ids = req.body.id;
        const user = req.user;

        await NotificationService.readNotifications(user.id, ids);

        return res.status(RequestStatuses.Created).json();
    }
}
