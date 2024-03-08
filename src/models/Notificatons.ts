import { Notify, UserNotify } from "../ts";
import { prisma } from "../db";

export default class Notifications {
    public static async createUserAnimeNotifications(notify: UserNotify){
        const {user_id, anime_id, status, group_id, episode} = notify;
        return prisma.user_anime_notifications.create({
            data: {
                user_id, 
                anime_id,
                status,
                group_id,
                episode,
            }
        })
    }

    public static async createAnimeNotifications(notify: Notify){
        const {anime_id, status, group_id, episode} = notify
        return prisma.anime_notifications.create({
            data: {
                anime_id,
                status,
                group_id,
                episode,
            }
        })
    }
}