import { Notify, UserNotify } from "../ts";
import { prisma } from "../db";

export default class Notifications {
    public static async createUserAnimeNotifications({ userId, animeId, status, groupId, episode }: UserNotify) {
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

    public static async createAnimeNotifications({ animeId, status, groupId, episode }: Notify) {
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