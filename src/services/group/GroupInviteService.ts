import BaseError from "../../errors/BaseError";
import { RequestStatuses } from "../../ts/enums";
import { prisma } from "../../db";
import { User, Group_list, Group_list_invites } from "@prisma/client";

type UserWithGroup = User & {
    owned_groups: Group_list[]
}

type UserWithInvites = User & {
    group_invites: Group_list_invites[],
}

interface InviteUser {
    owner: UserWithGroup,
    user_id: number,
    group_id: number
}

interface InviteAction {
    user: UserWithInvites,
    invite_id: number,
    modifyList?: boolean
}

export default class GroupInviteService {
    public static async getUserInvites(user_id: number) {
        return prisma.group_list_invites.findMany({
            where: { user_id }
        })
    }

    public static async inviteUser({ owner, user_id, group_id }: InviteUser) {
        if (user_id === owner.id) {
            throw new BaseError('cant_invite_yourself', {
                status: RequestStatuses.UnprocessableContent
            })
        }

        if (!owner.owned_groups.some(group => group.id === group_id)) {
            throw new BaseError('not_found', {
                status: RequestStatuses.NotFound
            })
        }

        await prisma.user.findFirstOrThrow({ where: { id: user_id } });

        const userInvite = await prisma.group_list_invites.findMany({
            where: {
                group_id,
                user_id
            }
        })

        if (userInvite.length > 0) {
            throw new BaseError('user_already_invited', {
                status: RequestStatuses.UnprocessableContent
            })
        }

        const member = await prisma.group_list_members.findFirst({
            where: {
                user_id,
                group_id
            }
        })

        if (member) {
            throw new BaseError('user_already_member', {
                status: RequestStatuses.UnprocessableContent
            })
        }

        await prisma.group_list_invites.create({
            data: { group_id, user_id }
        });
    }

    public static async deleteInvite({ owner, user_id, group_id }: InviteUser) {
        if (user_id === owner.id) {
            throw new BaseError('cant_delete_yourself', {
                status: RequestStatuses.UnprocessableContent
            })
        }

        if (!owner.owned_groups.some(group => group.id === group_id)) {
            throw new BaseError('not_found', {
                status: RequestStatuses.NotFound
            })
        }

        await prisma.user.findFirstOrThrow({ where: { id: user_id } });

        const userInvite = await prisma.group_list_invites.findMany({
            where: {
                group_id,
                user_id
            }
        })

        if (userInvite.length < 1) {
            throw new BaseError('user_not_invited', {
                status: RequestStatuses.UnprocessableContent
            })
        }

        await prisma.group_list_invites.deleteMany({
            where: { group_id, user_id }
        });
    }

    public static async acceptInvite({ user, invite_id, modifyList = false }: InviteAction) {

        const invite = user.group_invites.find(invite => invite.id === invite_id);
        if (!invite) {
            throw new BaseError("no invite found", { status: RequestStatuses.NotFound });
        }

        await prisma.group_list_invites.delete({ where: { id: invite.id } })

        await prisma.group_list_members.create({
            data: {
                group_id: invite.group_id,
                user_id: user.id,
                override_list: modifyList
            }
        })

    }

    public static async denyInvite({ user, invite_id }: InviteAction) {
        const invite = user.group_invites.find(invite => invite.id === invite_id);

        if (!invite) {
            throw new BaseError("no invite found", { status: RequestStatuses.NotFound });
        }

        await prisma.group_list_invites.delete({ where: { id: invite.id } })
    }
}

export { GroupInviteService as GroupInvitesService }