import { Notification, UserNotification } from '@/ts/notification';
import { NotifyStatuses } from '@enums';
import prisma from '@/db';
import Period from '@/helper/period';
import dayjs from 'dayjs';

export interface getUserNotifications {
    page: number;
    pageLimit: number;
    isRead: boolean;
}

export interface getNotifications {
    period: Date[];
    page: number;
    pageLimit: number;
}

export default class NotificationService {
    constructor() {}

    public static async notifyUserRelease(userId: number, animeId: number) {
        const notify: UserNotification = {
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
        const notify: UserNotification = {
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
        const notify: UserNotification = {
            userId,
            animeId,
            status: NotifyStatuses.FinalEpisodeReleased,
            groupId,
            episode
        };
        return this._notifyUserEpisode(notify);
    }

    public static async notifyRelease(animeId: number) {
        const notify: Notification = { animeId, status: NotifyStatuses.AnimeRelease };
        return this._notifyEpisode(notify);
    }

    public static async notifyEpisode(animeId: number, groupId: number, episode: number) {
        const notify: Notification = {
            animeId,
            status: NotifyStatuses.EpisodeRelease,
            episode,
            groupId
        };
        return this._notifyEpisode(notify);
    }

    public static async notifyFinalEpisode(animeId: number, groupId: number, episode: number) {
        const notify: Notification = {
            animeId,
            status: NotifyStatuses.FinalEpisodeReleased,
            episode,
            groupId
        };
        return this._notifyEpisode(notify);
    }

    private static async _notifyUserEpisode(notify: UserNotification) {
        return prisma.userAnimeNotifications.createUserAnimeNotifications(notify);
    }

    private static async _notifyEpisode({ animeId, status, groupId, episode }: Notification) {
        return prisma.animeNotifications.create({
            data: {
                animeId,
                status,
                groupId,
                episode
            }
        });
    }

    public static async getUserNotificationsCount(userId: number, isRead: boolean) {
        const _count = await prisma.userAnimeNotifications.aggregate({
            _count: {
                id: true
            },
            where: {
                userId,
                isRead
            }
        });

        return _count._count.id;
    }

    public static async getNotificationsCount(period: Date[]) {
        if (typeof period === 'undefined')
            period = [dayjs().subtract(2, 'weeks').toDate(), dayjs().toDate()];
        period = Period.getPeriod(period);
        const _count = await prisma.userAnimeNotifications.aggregate({
            _count: {
                id: true
            },
            where: {
                createdAt: {
                    gte: period[0],
                    lte: period[1]
                }
            }
        });

        return _count._count.id;
    }

    public static async getUserNotifications(
        userId: number,
        { isRead, page, pageLimit }: getUserNotifications
    ) {
        const count = await this.getUserNotificationsCount(userId, isRead);
        const notifications = await prisma.userAnimeNotifications.findMany({
            take: pageLimit,
            skip: (page - 1) * pageLimit,
            orderBy: { createdAt: 'asc' },
            where: {
                isRead,
                userId
            },
            include: {
                anime: {
                    select: {
                        slug: true,
                        image: true,
                        name: true
                    }
                },
                group: {
                    select: {
                        name: true,
                        type: true
                    }
                }
            }
        });

        return {
            count,
            notifications
        };
    }

    public static async getNotifications({ period, page, pageLimit }: getNotifications) {
        if (typeof period === 'undefined')
            period = [dayjs().subtract(2, 'weeks').toDate(), dayjs().toDate()];
        period = Period.getPeriod(period);

        const count = await this.getNotificationsCount(period);
        const notifications = prisma.animeNotifications.findMany({
            take: pageLimit,
            skip: (page - 1) * pageLimit,
            where: {
                createdAt: {
                    gte: period[0],
                    lte: period[1]
                }
            },
            include: {
                anime: {
                    select: {
                        slug: true,
                        image: true,
                        name: true
                    }
                },
                group: {
                    select: {
                        name: true,
                        type: true
                    }
                }
            }
        });

        return {
            count,
            notifications
        };
    }

    public static async readNotifications(userId: number, ids?: number[]) {
        if (typeof ids === 'undefined') ids = [];
        return prisma.userAnimeNotifications.readNotifications(ids, userId);
    }
}
