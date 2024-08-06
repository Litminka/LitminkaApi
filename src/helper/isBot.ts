import prisma from '@/db';
import { Permissions } from '@enums';

export default async function isBot(id: number) {
    const botUser = await prisma.user.findUserById(id, {
        role: {
            include: {
                permissions: true
            }
        }
    });
    let isBot = botUser?.role.permissions.some((perm) => {
        return perm.name === Permissions.ApiServiceBot;
    });
    isBot = isBot ?? false;
    return isBot;
}
