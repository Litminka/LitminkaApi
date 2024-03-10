import { Notify, UserNotify } from "../ts";
import { NotifyStatuses } from "../ts/enums";
import prisma from "../db";
import Period from "../helper/period";
import dayjs from "dayjs";

interface getUserNotifications {
    period: Date[],
    userId: number,
    isRead: boolean
}


export default class NotificationService {
    constructor() {

    }

    public static async notifyUserRelease(userId: number, animeId: number) {
        const notify: UserNotify = { userId, animeId, status: NotifyStatuses.AnimeRelease }
        return this._notifyUserEpisode(notify)
    }

    public static async notifyUserEpisode(userId: number, animeId: number, groupId: number, episode: number) {
        const notify: UserNotify = { userId, animeId, status: NotifyStatuses.EpisodeRelease, groupId, episode }
        return this._notifyUserEpisode(notify)
    }

    public static async notifyUserFinalEpisode(userId: number, animeId: number, groupId: number, episode: number) {
        const notify: UserNotify = { userId, animeId, status: NotifyStatuses.FinalEpisodeReleased, groupId, episode }
        return this._notifyUserEpisode(notify)
    }

    public static async notifyRelease(animeId: number) {
        const notify: Notify = { animeId, status: NotifyStatuses.AnimeRelease }
        return this._notifyEpisode(notify)
    }

    public static async notifyEpisode(animeId: number, groupId: number, episode: number) {
        const notify: Notify = { animeId, status: NotifyStatuses.EpisodeRelease, episode, groupId }
        return this._notifyEpisode(notify)
    }

    public static async notifyFinalEpisode(animeId: number, groupId: number, episode: number) {
        const notify: Notify = { animeId, status: NotifyStatuses.FinalEpisodeReleased, episode, groupId }
        return this._notifyEpisode(notify)
    }

    private static async _notifyUserEpisode(notify: UserNotify) {
        return prisma.userAnimeNotifications.createUserAnimeNotifications(notify);
    }

    private static async _notifyEpisode(notify: Notify) {
        return prisma.animeNotifications.createAnimeNotifications(notify);
    }

    public static async getUserNotifications({ isRead = false, userId, period }: getUserNotifications) {
        if (typeof period === 'undefined') period = [dayjs().subtract(2, 'weeks').toDate(), dayjs().toDate()]
        period = Period.getPeriod(period)
        return prisma.userAnimeNotifications.findMany({
            where: {
                isRead,
                userId,
                createdAt: {
                    lte: period[1],
                    gte: period[0]
                }
            }
        })
    }

    public static async getNotifications(period: Date[]) {
        if (typeof period === 'undefined') period = [dayjs().subtract(2, 'weeks').toDate(), dayjs().toDate()]
        period = Period.getPeriod(period)
        return prisma.animeNotifications.findMany({
            where: {
                createdAt: {
                    gte: period[0],
                    lte: period[1]
                }
            }
        })
    }

    public static async readNotifications(ids: number[], userId: number) {
        return prisma.userAnimeNotifications.updateMany({
            where: {
                userId,
                id: {
                    in: ids
                }
            },
            data: { isRead: true }
        })
    }
}