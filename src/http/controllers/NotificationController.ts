import { Response } from 'express';
import Period from '@/helper/period';
import NotificationService from '@services/NotificationService';
import { RequestStatuses } from '@enums';
import { GetUserNotificationsReq } from '@requests/notification/GetUserNotificationsRequest';
import { GetNotificationsReq } from '@requests/notification/GetNotificationsRequest';
import { ReadNotificationsReq } from '@requests/notification/ReadNotificationsRequest';

export default class NotificationController {
    public static async getUserNotifications(req: GetUserNotificationsReq, res: Response) {
        const userId = req.auth.user.id;
        const isRead = req.body.isRead;
        const period = req.body.period;

        const notifications = await NotificationService.getUserNotifications({
            isRead,
            userId,
            period
        });

        return res.status(RequestStatuses.OK).json({ body: notifications });
    }

    public static async getNotifications(req: GetNotificationsReq, res: Response) {
        const period = req.body.period;

        const notifications = await NotificationService.getNotifications(Period.getPeriod(period));

        return res.status(RequestStatuses.OK).json({ body: notifications });
    }

    public static async readNotifications(req: ReadNotificationsReq, res: Response) {
        const ids = req.body.id;
        const user = req.auth.user;

        await NotificationService.readNotifications(user.id, ids);

        return res.status(RequestStatuses.Created);
    }
}
