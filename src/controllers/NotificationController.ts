import { Response } from "express";
import { prisma } from '../db';
import { RequestWithAuth } from "../ts";
import dayjs from "dayjs";
import Period from "../helper/period";
import { RequestStatuses } from "../ts/enums";
import NotificationService from "../services/NotificationService";

export default class NotificationController {
    public static async getUserNotifications(req: RequestWithAuth, res: Response) {
        const user_id = req.auth!.id
        const is_read: boolean = req.body.is_read as boolean
        let created_at = [dayjs().subtract(2, 'weeks').toDate(), dayjs().toDate()]

        if (req.body.created_at != undefined) created_at = req.body.created_at
        created_at = Period.getPeriod(created_at)

        const notifications = await NotificationService.getUserNotifications({
            is_read, user_id, period: created_at
        })

        return res.json(notifications)
    }

    public static async getNotifications(req: RequestWithAuth, res: Response) {
        let created_at = [dayjs().subtract(2, 'weeks').toDate(), dayjs().toDate()]

        if (req.body.created_at != undefined) created_at = req.body.created_at

        const notifications = await NotificationService.getNotifications(Period.getPeriod(created_at))

        return res.json(notifications)
    }

    public static async readNotifications(req: RequestWithAuth, res: Response) {
        const ids: number[] = req.body.id
        const user_id: number = req.auth!.id

        await NotificationService.readNotifications(ids, user_id)

        return res.status(RequestStatuses.OK).json({ message: "Notifications readed" })
    }
}