import { Notify, UserNotify } from "../ts";
import { prisma } from "../db";

export default class Notifications {
    public static async createUserAnimeNotifications(notify: UserNotify){
        const {userId, animeId, status, groupId, episode} = notify;
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

    public static async createAnimeNotifications(notify: Notify){
        const {animeId, status, groupId, episode} = notify
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