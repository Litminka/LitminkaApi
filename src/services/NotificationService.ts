import { prisma } from "../db";
export default class NotificationService {
    constructor() {

    }

    async notifyUserRelease(user_id: number, anime_id: number) {
        return prisma.user_anime_notifications.create({
            data: {
                user_id, anime_id,
                status: "anime_released"
            }
        })
    }

    async notifyUserEpisode(user_id: number, anime_id: number, group_id: number, episode: number) {
        return prisma.user_anime_notifications.create({
            data: {
                user_id, anime_id,
                status: "episode_released",
                group_id,
                episode,
            }
        })
    }

    async notifyUserFinalEpisode(user_id: number, anime_id: number, group_id: number, episode: number) {
        return prisma.user_anime_notifications.create({
            data: {
                user_id, anime_id,
                status: "final_episode_released",
                group_id,
                episode,
            }
        })
    }

    async notifyRelease(anime_id: number) {
        return prisma.anime_notifications.create({
            data: {
                anime_id,
                status: "anime_released"
            }
        })
    }

    async notifyEpisode(anime_id: number, group_id: number, episode: number) {
        return prisma.anime_notifications.create({
            data: {
                anime_id,
                status: "episode_released",
                group_id,
                episode,
            }
        })
    }

    async notifyFinalEpisode(anime_id: number, group_id: number, episode: number) {
        return prisma.anime_notifications.create({
            data: {
                anime_id,
                status: "final_episode_released",
                group_id,
                episode,
            }
        })
    }
}