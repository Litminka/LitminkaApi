import { Group_list, Group_list_invites, User } from "@prisma/client";
import { prisma } from "../db";
import BaseError from "../errors/BaseError";
import { RequestStatuses } from "../ts/enums";

type UserWithGroup = User & {
    owned_lists: Group_list[]
}

type UserWithInvites = User & {
    group_list_invites: Group_list_invites[],
}

interface CreateGroup {
    description: string,
    name: string,
    user: UserWithGroup
}

interface InviteUser {
    owner: UserWithGroup,
    idToInvite: number,
    list_id: number
}

interface InviteAction {
    user: UserWithInvites,
    invite_id: number,
    modifyList?: boolean
}

export default class GroupListService {
    public static async getOwnedGroups(owner_id: number) {
        return prisma.group_list.findMany({
            where: { owner_id }
        });
    }

    public static async createGroup({ description, name, user }: CreateGroup) {
        if (user.owned_lists.length >= 10) {
            throw new BaseError('too_many_groups', {
                status: RequestStatuses.BadRequest
            });
        }

        const group = await prisma.group_list.create({
            data: {
                description,
                name,
                owner_id: user.id,
            }
        })

        prisma.group_list_members.create({
            data: {
                group_id: group.id,
                user_id: user.id,
                override_list: true, // TODO: add variable to change
            }
        })

        return group;

    }

    public static async getUserInvites(user_id: number) {
        return prisma.group_list_invites.findMany({
            where: { user_id }
        })
    }

    // FIXME: Determine if its a list or a group
    public static async inviteUser({ owner, idToInvite, list_id }: InviteUser) {
        if (idToInvite === owner.id) {
            throw new BaseError('cant_invite_yourself', {
                status: RequestStatuses.UnprocessableContent
            })
        }

        if (!owner.owned_lists.some(list => list.id === list_id)) {
            throw new BaseError('not_found', {
                status: RequestStatuses.NotFound
            })
        }

        await prisma.user.findFirstOrThrow({ where: { id: idToInvite } });

        const userInvite = await prisma.group_list_invites.findMany({
            where: {
                list_id,
                user_id: idToInvite
            }
        })

        if (userInvite.length > 0) {
            throw new BaseError('user_already_invited', {
                status: RequestStatuses.UnprocessableContent
            })
        }

        const member = await prisma.group_list_members.findFirst({
            where: {
                user_id: idToInvite,
                group_id: list_id
            }
        })

        if (member) {
            throw new BaseError('user_already_member', {
                status: RequestStatuses.UnprocessableContent
            })
        }

        await prisma.group_list_invites.create({
            data: { list_id, user_id: idToInvite }
        });
    }

    public static async acceptInvite({ user, invite_id, modifyList = false }: InviteAction) {

        const invite = user.group_list_invites.find(invite => invite.id === invite_id);
        if (!invite) {
            throw new BaseError("no invite found", { status: RequestStatuses.NotFound });
        }

        await prisma.group_list_invites.delete({ where: { id: invite.id } })

        await prisma.group_list_members.create({
            data: {
                group_id: invite.list_id,
                user_id: user.id,
                override_list: modifyList
            }
        })

    }

    public static async denyInvite({ user, invite_id }: InviteAction) {
        const invite = user.group_list_invites.find(invite => invite.id === invite_id);
        if (!invite) {
            throw new BaseError("no invite found", { status: RequestStatuses.NotFound });
        }

        await prisma.group_list_invites.delete({ where: { id: invite.id } })
    }
}