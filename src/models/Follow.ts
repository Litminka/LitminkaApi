import { prisma } from "../db";
import { FollowAnime } from "../ts";

export default class FollowModel {

    public static async findFollow({ animeId, userId, status, translationGroupName }: FollowAnime) {
        return await prisma.follow.findFirst({
            where: {
                animeId,
                userId,
                status,
                translation: {
                    group: {
                        name: translationGroupName
                    }
                }
            }
        })
    }

    public static async removeFollow({ animeId, userId, translationId }: FollowAnime) {
        await prisma.follow.deleteMany({
            where: {
                userId,
                animeId,
                translationId
            }
        })
    }
}