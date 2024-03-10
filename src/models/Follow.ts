import { prisma } from "../db";
import { FollowAnime } from "../ts";

export default class FollowModel {
    
    public static async findFollow(follow: FollowAnime){
        const {animeId, userId, status, translationGroupName} = follow;
        
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

    public static async removeFollow(follow: FollowAnime){
        const {animeId, userId, translationId} = follow;
        await prisma.follow.deleteMany({
            where: {
                userId,
                animeId,
                translationId
            }
        })
    }
}