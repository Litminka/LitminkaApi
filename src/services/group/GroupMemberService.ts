import { prisma } from "../../db";
import BaseError from "../../errors/BaseError";
import { RequestStatuses } from "../../ts/enums";


interface EditMember {
    user_id: number,
    group_id: number,
    modifyList?: boolean
}

export default class GroupMemberService {
    public static async getMemberGroup(user_id: number) {

        return prisma.group_list_members.findMany({
            where: { user_id },
            include: {
                group: true,
            }
        });

    }

    public static async getGroupMembers(user_id: number, group_id: number) {

        await prisma.group_list_members.findFirstOrThrow({
            where: {
                user_id, group_id
            }
        });

        return prisma.group_list.findMany({
            where: { id: group_id },
            include: {
                members: true,
            }
        });
    }

    public static async leaveGroup(user_id: number, group_id: number) {

        const group = await prisma.group_list.findFirstOrThrow({
            where: {
                id: group_id,
            },
            include: {
                members: true
            }
        })

        if (group.owner_id === user_id) throw new BaseError("cant_leave_if_owner", { status: RequestStatuses.UnprocessableContent });

        if (!group.members.some(member => member.user_id === user_id)) {
            throw new BaseError("you_are_not_a_member", {
                status: RequestStatuses.UnprocessableContent
            });
        }

        await prisma.group_list_members.deleteMany({
            where: {
                group_id, user_id
            }
        })
    }

    public static async updateState({ user_id, group_id, modifyList }: EditMember) {

        await prisma.group_list_members.findFirstOrThrow({
            where: {
                user_id, group_id
            }
        })

        return await prisma.group_list_members.updateMany({
            where: {
                group_id, user_id
            },
            data: {
                override_list: modifyList
            }
        })

    }
}