import { prisma } from "../db";

export default class Integration {
    
    public static async findByShikimoriId(id: number){
        return await prisma.integration.findFirst({
            where: {
                shikimoriId: id
            }
        });
    }

    public static async updateUserShikimoriId(userId: number, shikimoriId: number){
        await prisma.integration.update({
            where: {
                userId
            },
            data: {
                shikimoriId
            }
        });
    }

    public static async clear(userId: number){
        await prisma.integration.update({
            where: {
                userId
            },
            data: {
                shikimoriCode: null,
                shikimoriToken: null,
                shikimoriRefreshToken: null,
                shikimoriId: null,
            }
        });
    }
}