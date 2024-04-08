import prisma from '@/db';
import { Permissions } from '@/ts/enums';

export default async function isBot(id: number) {
    const botUser = await prisma.user.findUserByIdWithRolePermission(id);
    let isBot = botUser?.role.permissions.some((perm) => {
        return perm.name === Permissions.ApiServiceBot;
    });
    isBot = isBot ?? false;
    return isBot;
}
