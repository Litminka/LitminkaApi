import { Group_list, Group_list_invites, User } from "@prisma/client";
import { prisma } from "../../db";
import BaseError from "../../errors/BaseError";
import { RequestStatuses } from "../../ts/enums";
import { group } from "console";

type UserWithGroup = User & {
    owned_groups: Group_list[]
}

type UserWithInvites = User & {
    group_invites: Group_list_invites[],
}

interface CreateGroup {
    description: string,
    name: string,
    user: UserWithGroup
}

interface UpdateGroup {
    description?: string,
    name?: string,
    user: UserWithGroup,
    group_id: number
}



export default class GroupListService {
    public static async getOwnedGroups(owner_id: number) {
        return prisma.group_list.findMany({
            where: { owner_id }
        });
    }



    public static async createGroup({ description, name, user }: CreateGroup) {
        if (user.owned_groups.length >= 10) {
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

        await prisma.group_list_members.create({
            data: {
                group_id: group.id,
                user_id: user.id,
                override_list: true, // TODO: add variable to change
            }
        })

        return group;

    }

    public static async deleteGroup(id: number, owner_id: number) {

        const group = await prisma.group_list.findFirstOrThrow({
            where: { id }
        })

        if (group.owner_id !== owner_id) {
            throw new BaseError("not_an_owner", { status: RequestStatuses.Forbidden });
        }

        await prisma.group_list.delete({
            where: { id }
        });
    }
    

    public static async updateGroup({ description, name, user, group_id }: UpdateGroup) {

        if (!user.owned_groups.some(group => group.id === group_id)) {
            throw new BaseError("not_an_owner", { status: RequestStatuses.Forbidden });
        }

        return prisma.group_list.update({
            where: { id: group_id },
            data: {
                description,
                name
            }
        })
    }

}