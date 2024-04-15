import BaseError from '@/errors/BaseError';
import { RequestStatuses } from '@enums';
import prisma from '@/db';
import { User, GroupList, GroupListInvites } from '@prisma/client';

type UserWithGroup = User & {
    ownedGroups: GroupList[];
};

type UserWithInvites = User & {
    groupInvites: GroupListInvites[];
};

interface InviteUser {
    owner: UserWithGroup;
    userId: number;
    groupId: number;
}

interface InviteAction {
    user: UserWithInvites;
    inviteId: number;
    modifyList?: boolean;
}

export default class GroupInviteService {
    public static async getUserInvites(userId: number) {
        return prisma.groupListInvites.findMany({
            where: { userId }
        });
    }

    public static async inviteUser({ owner, userId, groupId }: InviteUser) {
        if (userId === owner.id) {
            throw new BaseError('cant_invite_yourself', {
                status: RequestStatuses.UnprocessableContent
            });
        }

        if (
            !owner.ownedGroups.some((group) => {
                return group.id === groupId;
            })
        ) {
            throw new BaseError('not_found', {
                status: RequestStatuses.NotFound
            });
        }

        await prisma.user.findFirstOrThrow({ where: { id: userId } });

        const userInvite = await prisma.groupListInvites.findMany({
            where: {
                groupId,
                userId
            }
        });

        if (userInvite.length > 0) {
            throw new BaseError('user_already_invited', {
                status: RequestStatuses.UnprocessableContent
            });
        }

        const member = await prisma.groupListMembers.findFirst({
            where: {
                userId,
                groupId
            }
        });

        if (member) {
            throw new BaseError('user_already_member', {
                status: RequestStatuses.UnprocessableContent
            });
        }

        await prisma.groupListInvites.create({
            data: { groupId, userId }
        });
    }

    public static async deleteInvite({ owner, userId, groupId }: InviteUser) {
        if (userId === owner.id) {
            throw new BaseError('cant_delete_yourself', {
                status: RequestStatuses.UnprocessableContent
            });
        }

        if (
            !owner.ownedGroups.some((group) => {
                return group.id === groupId;
            })
        ) {
            throw new BaseError('not_found', {
                status: RequestStatuses.NotFound
            });
        }

        await prisma.user.findFirstOrThrow({ where: { id: userId } });

        const userInvite = await prisma.groupListInvites.findMany({
            where: {
                groupId,
                userId
            }
        });

        if (userInvite.length < 1) {
            throw new BaseError('user_not_invited', {
                status: RequestStatuses.UnprocessableContent
            });
        }

        await prisma.groupListInvites.deleteMany({
            where: { groupId, userId }
        });
    }

    public static async acceptInvite({ user, inviteId, modifyList = false }: InviteAction) {
        const invite = user.groupInvites.find((invite) => {
            return invite.id === inviteId;
        });
        if (!invite) {
            throw new BaseError('no invite found', {
                status: RequestStatuses.NotFound
            });
        }

        await prisma.groupListInvites.delete({ where: { id: invite.id } });

        await prisma.groupListMembers.create({
            data: {
                groupId: invite.groupId,
                userId: user.id,
                overrideList: modifyList
            }
        });
    }

    public static async denyInvite({ user, inviteId }: InviteAction) {
        const invite = user.groupInvites.find((invite) => {
            return invite.id === inviteId;
        });

        if (!invite) {
            throw new BaseError('no invite found', {
                status: RequestStatuses.NotFound
            });
        }

        await prisma.groupListInvites.delete({ where: { id: invite.id } });
    }
}

export { GroupInviteService as GroupInvitesService };
