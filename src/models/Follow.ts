import { prisma } from "../db";
import { FollowAnime } from "../ts";

export default class FollowModel {
    
    public static async findFollow(follow: FollowAnime){
        const {anime_id, user_id, status, translation_group_name} = follow;
        
        return await prisma.follow.findFirst({
            where: {
                anime_id,
                user_id,
                status,
                translation: {
                    group: {
                        name: translation_group_name
                    }
                }
            }
        })
    }

    public static async removeFollow(follow: FollowAnime){
        const {anime_id, user_id, translation_id} = follow;
        await prisma.follow.deleteMany({
            where: {
                user_id,
                anime_id,
                translation_id
            }
        })
    }
}