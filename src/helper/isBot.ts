import prisma from '@/db';
import { Permissions } from '@/ts/enums';

export default async function isBot(id: number) {
    const botUser = await prisma.user.findUserByIdWithRolePermission(id);
    let isBot = botUser?.role.permissions.some((perm) => perm.name === Permissions.ApiServiceBot);
    isBot = isBot ?? false;
    return isBot;
}
