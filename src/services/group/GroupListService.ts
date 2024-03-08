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

    

}