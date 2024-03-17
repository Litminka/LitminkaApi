import { Response } from "express";
import { RequestWithUser } from "@/ts";
import Period from "@/helper/period";
import NotificationService from "@services/NotificationService";
import { RequestStatuses } from "@/ts/enums";

export default class NotificationController {
    public static async getUserNotifications(req: RequestWithUser, res: Response): Promise<Object> {
        const user = req.auth.user;
        const isRead: boolean = req.body.isRead as boolean
        const createdAt = req.body.createdAt;

        const notifications = await NotificationService.getUserNotifications({
            isRead, userId: user.id, period: createdAt
        })

        return res.json(notifications)
    }

    public static async getNotifications(req: RequestWithUser, res: Response): Promise<Object> {
        const createdAt = req.body.createdAt;

        const notifications = await NotificationService.getNotifications(Period.getPeriod(createdAt))

        return res.json(notifications)
    }

    public static async readNotifications(req: RequestWithUser, res: Response) {
        const ids: number[] = req.body.id;
        const user = req.auth.user;

        await NotificationService.readNotifications(ids, user.id)

        return res.status(RequestStatuses.OK).json({ message: "notifications_read" })
    }
}