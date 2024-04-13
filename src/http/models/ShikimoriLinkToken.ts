import prisma from '@/db';
import { Prisma } from '@prisma/client';

const extention = Prisma.defineExtension({
    name: 'ShikimoriLinkToken',
    model: {
        shikimoriLinkToken: {
            async updateWithCode(token: string, code: string) {
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
                });
            },
            async removeToken(token: string) {
                await prisma.shikimoriLinkToken.delete({
                    where: { token }
                });
            },
            async createShikimoriLinkTokenByUserId(token: string, userId: number) {
                await prisma.shikimoriLinkToken.upsert({
                    where: { userId },
                    update: {
                        token: token
                    },
                    create: {
                        userId,
                        token
                    }
                });
            }
        }
    }
});

export { extention as ShikimoriLinkTokenExt };
