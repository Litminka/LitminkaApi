import { Notify, UserNotify } from '@/ts';
import { NotifyStatuses } from '@/ts/enums';
import prisma from '@/db';
import Period from '@/helper/period';
import dayjs from 'dayjs';

export interface getUserNotifications {
    period: Date[];
    userId: number;
    isRead: boolean;
}

export default class NotificationService {
    constructor() {}

    public static async notifyUserRelease(userId: number, animeId: number) {
        const notify: UserNotify = {
            userId,
            animeId,
            status: NotifyStatuses.AnimeRelease
        };
        return this._notifyUserEpisode(notify);
    }

    public static async notifyUserEpisode(
        userId: number,
        animeId: number,
        groupId: number,
        episode: number
    ) {
        const notify: UserNotify = {
            userId,
            animeId,
            status: NotifyStatuses.EpisodeRelease,
            groupId,
            episode
        };
        return this._notifyUserEpisode(notify);
    }

    public static async notifyUserFinalEpisode(
        userId: number,
        animeId: number,
        groupId: number,
        episode: number
    ) {
        const notify: UserNotify = {
            userId,
            animeId,
            status: NotifyStatuses.FinalEpisodeReleased,
            groupId,
            episode
        };
        return this._notifyUserEpisode(notify);
    }

    public static async notifyRelease(animeId: number) {
        const notify: Notify = { animeId, status: NotifyStatuses.AnimeRelease };
        return this._notifyEpisode(notify);
    }

    public static async notifyEpisode(animeId: number, groupId: number, episode: number) {
        const notify: Notify = {
            animeId,
            status: NotifyStatuses.EpisodeRelease,
            episode,
            groupId
        };
        return this._notifyEpisode(notify);
    }

    public static async notifyFinalEpisode(animeId: number, groupId: number, episode: number) {
        const notify: Notify = {
            animeId,
            status: NotifyStatuses.FinalEpisodeReleased,
            episode,
            groupId
        };
        return this._notifyEpisode(notify);
    }

    private static async _notifyUserEpisode(notify: UserNotify) {
        return prisma.userAnimeNotifications.createUserAnimeNotifications(notify);
    }

    private static async _notifyEpisode(notify: Notify) {
        return prisma.animeNotifications.createAnimeNotifications(notify);
    }

    public static async getUserNotifications({
        isRead = false,
        userId,
        period
    }: getUserNotifications) {
        if (typeof period === 'undefined')
            period = [dayjs().subtract(2, 'weeks').toDate(), dayjs().toDate()];
        return prisma.userAnimeNotifications.getUserNotifications({
            isRead,
            userId,
            period: Period.getPeriod(period)
        });
    }

    public static async getNotifications(period: Date[]) {
        if (typeof period === 'undefined')
            period = [dayjs().subtract(2, 'weeks').toDate(), dayjs().toDate()];
        return prisma.animeNotifications.getNotifications(Period.getPeriod(period));
    }

    public static async readNotifications(userId: number, ids?: number[]) {
        if (typeof ids === 'undefined') ids = [];
        return prisma.userAnimeNotifications.readNotifications(ids, userId);
    }
}
