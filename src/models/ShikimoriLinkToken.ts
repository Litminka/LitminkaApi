import { prisma } from "../db";

export default class ShikimoriLinkToken {
    public static async updateWithCode(token: string, code: string) {
        await prisma.shikimori_Link_Token.update({
            where: { token },
            data: {
                user: {
                    update: {
                        integration: {
                            upsert: {
                                create: {
                                    shikimori_code: code
                                },
                                update: {
                                    shikimori_code: code
                                }
                            }
                        }
                    }
                }
            }
        })
    }

    public static async removeToken(token: string){
        await prisma.shikimori_Link_Token.delete({
            where: { token }
        });
    }
}