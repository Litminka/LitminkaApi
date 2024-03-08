import { Response } from "express";
import { prisma } from '../db';
import { RequestWithAuth } from "../ts";
import dayjs from "dayjs";

export default class NotificationsController {
    public static async userNotifications(req: RequestWithAuth, res: Response) {
        const user_id = req.auth!.id
        const is_read: boolean = req.body.is_read as boolean
        const notifications = await prisma.user_anime_notifications.findMany({
            where: {
                is_read,
                user_id
            }
        })
        return res.json(notifications)
    }

    public static async globalNotifications(req: RequestWithAuth, res: Response) {
        let date = dayjs().subtract(2, 'weeks').toDate()
        if (req.body.created_at != undefined) { date = dayjs(req.body.created_at).toDate() }
        const notifications = await prisma.anime_notifications.findMany({
            where: {
                created_at: {
                    gt: date
                }
            }
        })
        return res.json(notifications)
    }
}