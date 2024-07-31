import { UserNotification } from '@/ts/notification';
import prisma from '@/db';
import { Prisma } from '@prisma/client';
import { getUserNotifications } from '@services/NotificationService';

const extention = Prisma.defineExtension({
    name: 'UserNotificationModel',
    model: {
        userAnimeNotifications: {
            async createUserAnimeNotifications({
                userId,
                animeId,
                status,
                groupId,
                episode
            }: UserNotification) {
                return prisma.userAnimeNotifications.create({
                    data: {
                        userId,
                        animeId,
                        status,
                        groupId,
                        episode
                    }
                });
            },
            async readNotifications(ids: number[], userId: number) {
                const query: Prisma.UserAnimeNotificationsUpdateManyArgs = {
                    where: {
                        userId
                    },
                    data: { isRead: true }
                };

                if (ids.length !== 0)
                    query.where = {
                        userId,
                        id: { in: ids }
                    };
                return prisma.userAnimeNotifications.updateMany(query);
            }
        }
    }
});

export { extention as UserNotificationExt };
