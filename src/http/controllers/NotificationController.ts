import { Response } from 'express';
import Period from '@/helper/period';
import NotificationService from '@services/NotificationService';
import { RequestStatuses } from '@enums';
import GetUserNotificationsRequest from '@requests/notification/GetUserNotificationsRequest';
import GetNotificationsRequest from '@requests/notification/GetNotificationsRequest';
import ReadNotificationsRequest from '@requests/notification/ReadNotificationsRequest';
import GetUserNotificationsCountRequest from '@requests/notification/GetUserNotificationsCountRequest';

export default class NotificationController {
    public static async getUserNotifications(req: GetUserNotificationsRequest, res: Response) {
        const userId = req.user.id;
        const isRead = req.query.isRead;
        const page = req.query.page;
        const pageLimit = req.query.pageLimit;

        const notifications = await NotificationService.getUserNotifications(userId, {
            page,
            pageLimit,
            isRead
        });

        return res.status(RequestStatuses.OK).json({ body: notifications });
    }

    public static async getUserNotificationsCount(
        req: GetUserNotificationsCountRequest,
        res: Response
    ) {
        const userId = req.user.id;
        const isRead = req.query.isRead;

        const count = await NotificationService.getUserNotificationsCount(userId, isRead);

        return res.status(RequestStatuses.OK).json({ body: { count } });
    }

    public static async getNotifications(req: GetNotificationsRequest, res: Response) {
        const period = Period.validatePeriod(req.query.period);
        const page = req.query.page;
        const pageLimit = req.query.pageLimit;

        const notifications = await NotificationService.getNotifications({
            period,
            page,
            pageLimit
        });

        return res.status(RequestStatuses.OK).json({ body: notifications });
    }

    public static async readNotifications(req: ReadNotificationsRequest, res: Response) {
        const ids = req.body.id;
        const user = req.user;

        await NotificationService.readNotifications(user.id, ids);

        return res.status(RequestStatuses.Created).json();
    }
}
