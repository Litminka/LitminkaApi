import { prisma } from "../db";
import { FollowAnime, ShikimoriWhoAmI } from "../ts";

export default class Integration {
    
    public static async findByShikimoriId(id: number){
        return await prisma.integration.findFirst({
            where: {
                shikimori_id: id
            }
        });
    }

    public static async updateUserShikimoriId(user_id: number, shikimori_id: number){
        await prisma.integration.update({
            where: {
                user_id
            },
            data: {
                shikimori_id
            }
        });
    }

    public static async clear(user_id: number){
        await prisma.integration.update({
            where: {
                user_id
            },
            data: {
                shikimori_code: null,
                shikimori_token: null,
                shikimori_refresh_token: null,
                shikimori_id: null,
            }
        });
    }
}