import { Response } from "express";
import { RequestWithAuth } from "../ts";
import Period from "../helper/period";
import { RequestStatuses } from "../ts/enums";
import NotificationService from "../services/NotificationService";

export default class NotificationController {
    public static async getUserNotifications(req: RequestWithAuth, res: Response): Promise<Object> {
        const userId = req.auth!.id
        const isRead: boolean = req.body.isRead as boolean
        const createdAt = req.body.createdAt;

        const notifications = await NotificationService.getUserNotifications({
            isRead, userId, period: createdAt
        })

        return res.json(notifications)
    }

    public static async getNotifications(req: RequestWithAuth, res: Response): Promise<Object> {
        const createdAt = req.body.createdAt;

        const notifications = await NotificationService.getNotifications(Period.getPeriod(createdAt))

        return res.json(notifications)
    }

    public static async readNotifications(req: RequestWithAuth, res: Response) {
        const ids: number[] = req.body.id
        const userId: number = req.auth!.id

        await NotificationService.readNotifications(ids, userId)

        return res.status(RequestStatuses.OK).json({ message: "notifications_read" })
    }
}