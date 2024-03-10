import Notifications from "../models/Notificatons";
import { Notify, UserNotify } from "../ts";
import { NotifyStatuses } from "../ts/enums";
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

    public static async notifyUserRelease(user_id: number, anime_id: number) {
        const notify: UserNotify = { user_id, anime_id, status: NotifyStatuses.AnimeRelease }
        return this._notifyUserEpisode(notify)
    }

    public static async notifyUserEpisode(user_id: number, anime_id: number, group_id: number, episode: number) {
        const notify: UserNotify = { user_id, anime_id, status: NotifyStatuses.EpisodeRelease, group_id, episode }
        return this._notifyUserEpisode(notify)
    }

    public static async notifyUserFinalEpisode(user_id: number, anime_id: number, group_id: number, episode: number) {
        const notify: UserNotify = { user_id, anime_id, status: NotifyStatuses.FinalEpisodeReleased, group_id, episode }
        return this._notifyUserEpisode(notify)
    }

    public static async notifyRelease(anime_id: number) {
        const notify: Notify = { anime_id, status: NotifyStatuses.AnimeRelease }
        return this._notifyEpisode(notify)
    }

    public static async notifyEpisode(anime_id: number, group_id: number, episode: number) {
        const notify: Notify = { anime_id, status: NotifyStatuses.EpisodeRelease, episode, group_id }
        return this._notifyEpisode(notify)
    }

    public static async notifyFinalEpisode(anime_id: number, group_id: number, episode: number) {
        const notify: Notify = { anime_id, status: NotifyStatuses.FinalEpisodeReleased, episode, group_id }
        return this._notifyEpisode(notify)
    }

    private static async _notifyUserEpisode(notify: UserNotify) {
        return Notifications.createUserAnimeNotifications(notify);
    }

    private static async _notifyEpisode(notify: Notify) {
        return Notifications.createAnimeNotifications(notify);
    }

    public static async getUserNotifications({ is_read = false, user_id, period }: getUserNotifications) {
        if (typeof period === 'undefined') period = [dayjs().subtract(2, 'weeks').toDate(), dayjs().toDate()]
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
        if (typeof period === 'undefined') period = [dayjs().subtract(2, 'weeks').toDate(), dayjs().toDate()]
        period = Period.getPeriod(period)
        return prisma.anime_notifications.findMany({
            where: {
                created_at: {
                    lte: period[1],
                    gte: period[0]
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