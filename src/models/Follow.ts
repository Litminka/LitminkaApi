import { prisma } from "../db";
import { FollowAnime } from "../ts";

export default class FollowModel {
    
    public static async findFirst(follow: FollowAnime){
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
}