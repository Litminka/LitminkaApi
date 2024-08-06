import { GroupList } from '@prisma/client';
import prisma from '@/db';
import BaseError from '@/errors/BaseError';
import { RequestStatuses } from '@enums';
import UnprocessableContentError from '@/errors/clienterrors/UnprocessableContentError';
import { UserWithoutPassword } from '@/ts/user';

interface EditMember {
    userId: number;
    groupId: number;
    modifyList?: boolean;
}

type UserWithGroup = UserWithoutPassword & {
    ownedGroups: GroupList[];
};

interface KickUser {
    user: UserWithGroup;
    groupId: number;
    kickId: number;
}

export default class GroupMemberService {
    public static async getMemberGroup(userId: number) {
        return prisma.groupListMembers.findMany({
            where: { userId },
            include: {
                group: true
            }
        });
    }

    public static async getGroupMembers(userId: number, groupId: number) {
        await prisma.groupListMembers.findFirstOrThrow({
            where: {
                userId,
                groupId
            }
        });

        return prisma.groupList.findMany({
            where: { id: groupId },
            include: {
                members: true
            }
        });
    }

    public static async leaveGroup(userId: number, groupId: number) {
        const group = await prisma.groupList.findFirstOrThrow({
            where: {
                id: groupId
            },
            include: {
                members: true
            }
        });

        if (group.ownerId === userId)
            throw new BaseError('cant_leave_if_owner', {
                status: RequestStatuses.UnprocessableContent
            });

        if (
            !group.members.some((member) => {
                return member.userId === userId;
            })
        ) {
            throw new BaseError('you_are_not_a_member', {
                status: RequestStatuses.UnprocessableContent
            });
        }

        await prisma.groupListMembers.deleteMany({
            where: {
                groupId,
                userId
            }
        });
    }

    public static async updateState({ userId, groupId, modifyList }: EditMember) {
        await prisma.groupListMembers.findFirstOrThrow({
            where: {
                userId,
                groupId
            }
        });

        return await prisma.groupListMembers.updateMany({
            where: {
                groupId,
                userId
            },
            data: {
                overrideList: modifyList
            }
        });
    }

    public static async kickUser({ user, groupId, kickId }: KickUser) {
        if (user.id === kickId) throw new UnprocessableContentError('cant_kick_yourself');

        if (
            !user.ownedGroups.some((group) => {
                return group.id === groupId;
            })
        ) {
            throw new BaseError('not_an_owner', {
                status: RequestStatuses.Forbidden
            });
        }

        await prisma.groupListMembers.deleteMany({
            where: {
                groupId,
                userId: kickId
            }
        });
    }
}
