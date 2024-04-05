import { Notify, UserNotify } from "@/ts";
import prisma from "@/db";
import { Prisma } from "@prisma/client";

const extention = Prisma.defineExtension({
    name: "AnimeNotificationModel",
    model: {
        animeNotifications: {
            async createAnimeNotifications({ animeId, status, groupId, episode }: Notify) {
                return prisma.animeNotifications.create({
                    data: {
                        animeId,
                        status,
                        groupId,
                        episode,
                    }
                })
            },
            async getNotifications(period: Date[]) {
                return prisma.animeNotifications.findMany({
                    where: {
                        createdAt: {
                            gte: period[0],
                            lte: period[1]
                        }
                    }
                })
            }
        }
    }
})

export { extention as AnimeNotificationExt }