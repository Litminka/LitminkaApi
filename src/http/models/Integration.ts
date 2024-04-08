import { Prisma } from '@prisma/client';
import prisma from '@/db';

const extention = Prisma.defineExtension({
    name: 'IntegrationModel',
    model: {
        integration: {
            async findByShikimoriId(id: number) {
                return await prisma.integration.findFirst({
                    where: {
                        shikimoriId: id
                    }
                });
            },
            async updateUserShikimoriId(userId: number, shikimoriId: number) {
                await prisma.integration.update({
                    where: {
                        userId
                    },
                    data: {
                        shikimoriId,
                        shikimoriCanChangeList: true
                    }
                });
            },
            async clearShikimoriIntegration(userId: number) {
                await prisma.integration.update({
                    where: {
                        userId
                    },
                    data: {
                        shikimoriCode: null,
                        shikimoriToken: null,
                        shikimoriRefreshToken: null,
                        shikimoriId: null,
                        shikimoriCanChangeList: null
                    }
                });
            }
        }
    }
});

export { extention as IntegrationExt };
