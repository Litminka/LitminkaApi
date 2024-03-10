import { GroupList, GroupListInvites, User } from "@prisma/client";
import { prisma } from "../../db";
import BaseError from "../../errors/BaseError";
import { RequestStatuses } from "../../ts/enums";

type UserWithGroup = User & {
    ownedGroups: GroupList[]
}

type UserWithInvites = User & {
    groupInvites: GroupListInvites[],
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
    groupId: number
}



export default class GroupListService {
    public static async getOwnedGroups(ownerId: number) {
        return prisma.groupList.findMany({
            where: { ownerId }
        });
    }



    public static async createGroup({ description, name, user }: CreateGroup) {
        if (user.ownedGroups.length >= 10) {
            throw new BaseError('too_many_groups', {
                status: RequestStatuses.BadRequest
            });
        }

        const group = await prisma.groupList.create({
            data: {
                description,
                name,
                ownerId: user.id,
            }
        })

        await prisma.groupListMembers.create({
            data: {
                groupId: group.id,
                userId: user.id,
                overrideList: true, // TODO: add variable to change
            }
        })

        return group;

    }

    public static async deleteGroup(id: number, ownerId: number) {

        const group = await prisma.groupList.findFirstOrThrow({
            where: { id }
        })

        if (group.ownerId !== ownerId) {
            throw new BaseError("not_an_owner", { status: RequestStatuses.Forbidden });
        }

        await prisma.groupList.delete({
            where: { id }
        });
    }


    public static async updateGroup({ description, name, user, groupId }: UpdateGroup) {

        if (!user.ownedGroups.some(group => group.id === groupId)) {
            throw new BaseError("not_an_owner", { status: RequestStatuses.Forbidden });
        }

        return prisma.groupList.update({
            where: { id: groupId },
            data: {
                description,
                name
            }
        })
    }

}