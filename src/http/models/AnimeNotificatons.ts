import { Notification } from '@/ts/notification';
import prisma from '@/db';
import { Prisma } from '@prisma/client';

const extention = Prisma.defineExtension({
    name: 'AnimeNotificationModel',
    model: {
        animeNotifications: {
            async createAnimeNotifications({ animeId, status, groupId, episode }: Notification) {
                return prisma.animeNotifications.create({
                    data: {
                        animeId,
                        status,
                        groupId,
                        episode
                    }
                });
            },
            async getNotifications(period: Date[]) {
                return prisma.animeNotifications.findMany({
                    where: {
                        createdAt: {
                            gte: period[0],
                            lte: period[1]
                        }
                    }
                });
            }
        }
    }
});

export { extention as AnimeNotificationExt };
