import { Notify, UserNotify } from "../ts";
import prisma from "../db";
import { Prisma } from "@prisma/client";

const extention = Prisma.defineExtension({
    name: "UserNotificationModel",
    model: {
        userAnimeNotifications: {
            async createUserAnimeNotifications({ userId, animeId, status, groupId, episode }: UserNotify) {
                return prisma.userAnimeNotifications.create({
                    data: {
                        userId,
                        animeId,
                        status,
                        groupId,
                        episode,
                    }
                })
            }
        }
    }
})

export { extention as UserNotificationExt }