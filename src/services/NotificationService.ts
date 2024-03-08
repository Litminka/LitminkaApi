import { prisma } from "../db";
import Period from "../helper/period";
import dayjs from "dayjs";

interface getUserNotifications {
    period: Date[],
    user_id: number,
    is_read: boolean
}

export default class NotificationService {
    constructor() {

    }

    async notifyUserRelease(user_id: number, anime_id: number) {
        return prisma.user_anime_notifications.create({
            data: {
                user_id,
                anime_id,
                status: "anime_released"
            }
        })
    }

    async notifyUserEpisode(user_id: number, anime_id: number, group_id: number, episode: number) {
        return prisma.user_anime_notifications.create({
            data: {
                user_id,
                anime_id,
                status: "episode_released",
                group_id,
                episode,
            }
        })
    }

    async notifyUserFinalEpisode(user_id: number, anime_id: number, group_id: number, episode: number) {
        return prisma.user_anime_notifications.create({
            data: {
                user_id,
                anime_id,
                status: "final_episode_released",
                group_id,
                episode,
            }
        })
    }

    async notifyRelease(anime_id: number) {
        return prisma.anime_notifications.create({
            data: {
                anime_id,
                status: "anime_released"
            }
        })
    }

    async notifyEpisode(anime_id: number, group_id: number, episode: number) {
        return prisma.anime_notifications.create({
            data: {
                anime_id,
                status: "episode_released",
                group_id,
                episode,
            }
        })
    }

    async notifyFinalEpisode(anime_id: number, group_id: number, episode: number) {

        return prisma.anime_notifications.create({
            data: {
                anime_id,
                status: "final_episode_released",
                group_id,
                episode,
            }
        })
    }

    public static async getUserNotifications({ is_read = false, user_id, period }: getUserNotifications) {
        if (period !== undefined) period = [dayjs().subtract(2, 'weeks').toDate(), dayjs().toDate()]
        period = Period.getPeriod(period)
        return prisma.user_anime_notifications.findMany({
            where: {
                is_read,
                user_id,
                created_at: {
                    lte: period[1],
                    gte: period[0]
                }
            }
        })
    }

    public static async getNotifications(period: Date[]) {
        if (period !== undefined) period = [dayjs().subtract(2, 'weeks').toDate(), dayjs().toDate()]
        period = Period.getPeriod(period)
        return prisma.anime_notifications.findMany({
            where: {
                created_at: {
                    gte: period[0],
                    lte: period[1]
                }
            }
        })
    }

    public static async readNotifications(ids: number[], user_id: number) {
        return prisma.user_anime_notifications.updateMany({
            where: {
                user_id,
                id: {
                    in: ids
                }
            },
            data: { is_read: true }
        })
    }
}