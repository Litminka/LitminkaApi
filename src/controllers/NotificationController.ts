import { Response } from "express";
import { prisma } from '../db';
import { RequestWithAuth } from "../ts";
import dayjs from "dayjs";
import Period from "../helper/period";
import { create } from "axios";

export default class NotificationController {
    public static async userNotifications(req: RequestWithAuth, res: Response) {
        const user_id = req.auth!.id
        const is_read: boolean = req.body.is_read as boolean
        let created_at = [dayjs().subtract(2, 'weeks').toDate(), dayjs().toDate()]
        if (req.body.created_at != undefined) created_at = req.body.created_at
        created_at = Period.getPeriod(created_at)
        const notifications = await prisma.user_anime_notifications.findMany({
            where: {
                is_read,
                user_id,
                created_at: {
                    lte: created_at[1],
                    gte: created_at[0]
                }
            }
        })
        return res.json(notifications)
    }

    public static async globalNotifications(req: RequestWithAuth, res: Response) {
        let created_at = [dayjs().subtract(2, 'weeks').toDate(), dayjs().toDate()]
        if (req.body.created_at != undefined) created_at = req.body.created_at
        created_at = Period.getPeriod(created_at)
        const notifications = await prisma.anime_notifications.findMany({
            where: {
                created_at: {
                    gte: created_at[0],
                    lte: created_at[1]
                }
            }
        })
        return res.json(notifications)
    }

    public static async notificationsIsRead(req: RequestWithAuth, res: Response) {

    }
}