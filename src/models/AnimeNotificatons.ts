import { Notify, UserNotify } from "../ts";
import prisma from "../db";
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
            }
        }
    }
})

export { extention as AnimeNotificationExt }