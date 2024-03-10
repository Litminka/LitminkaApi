import { prisma } from "../db";

export default class ShikimoriLinkToken {
    public static async updateWithCode(token: string, code: string) {
        await prisma.shikimoriLinkToken.update({
            where: { token },
            data: {
                user: {
                    update: {
                        integration: {
                            upsert: {
                                create: {
                                    shikimoriCode: code
                                },
                                update: {
                                    shikimoriCode: code
                                }
                            }
                        }
                    }
                }
            }
        })
    }

    public static async removeToken(token: string){
        await prisma.shikimoriLinkToken.delete({
            where: { token }
        });
    }

    public static async createShikimoriLinkTokenByUserId(token: string, userId: number){
        await prisma.shikimoriLinkToken.upsert({
            where: { userId },
            update: {
                token: token,
            },
            create: {
                userId,
                token,
            }
        })
    }
}