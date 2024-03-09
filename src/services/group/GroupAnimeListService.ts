import { Group_list, Group_list_members } from "@prisma/client"
import { prisma } from "../../db"
import BaseError from "../../errors/BaseError"
import { AddWithAnime } from "../../ts"
import { RequestStatuses } from "../../ts/enums"

interface AddToGroupList {
    user_id: number,
    group_id: number,
    data: AddWithAnime
}

interface DeleteFromGroupList {
    user_id: number,
    group_id: number,
    anime_id: number
}

type GroupWithMembers = Group_list & {
    members: Group_list_members[]
}

export default class GroupAnimeListService {
    public static async get(user_id: number, group_id: number) {
        await prisma.group_list_members.findFirstOrThrow({
            where: {
                AND: {
                    group_id,
                    user_id
                }
            }
        })

        return await prisma.group_anime_list.findMany({
            where: {
                group_id
            },
            include: {
                anime: true,
            }
        })
    }

    public static async add({ user_id, group_id, data }: AddToGroupList) {
        const group = await prisma.group_list.findFirstOrThrow({
            where: {
                id: group_id,
                owner_id: user_id
            },
            include: {
                list: true,
                members: true,
            }
        })

        if (group.list.some(list => list.anime_id == data.anime_id)) {
            throw new BaseError('anime_already_in_list', { status: RequestStatuses.UnprocessableContent });
        }

        await GroupAnimeListService.updateMembers(group, data);

        const { anime_id, is_favorite, rating, status, watched_episodes } = data;
        return await prisma.group_anime_list.create({
            data: {
                group_id,
                anime_id,
                is_favorite,
                rating,
                status,
                watched_episodes
            }
        })
    }

    public static async update({ user_id, group_id, data }: AddToGroupList) {
        const group = await prisma.group_list.findFirstOrThrow({
            where: {
                id: group_id,
                owner_id: user_id
            },
            include: {
                list: true,
                members: true,
            }
        })

        if (!group.list.some(list => list.anime_id == data.anime_id)) {
            throw new BaseError('no_anime_in_list', { status: RequestStatuses.UnprocessableContent });
        }

        await GroupAnimeListService.updateMembers(group, data);

        const { anime_id, is_favorite, rating, status, watched_episodes } = data;
        await prisma.group_anime_list.updateMany({
            where: {
                anime_id, group_id
            },
            data: {
                group_id,
                is_favorite,
                rating,
                status,
                watched_episodes
            }
        })


    }

    public static async delete({ user_id, group_id, anime_id }: DeleteFromGroupList) {
        const group = await prisma.group_list.findFirstOrThrow({
            where: {
                id: group_id,
                owner_id: user_id
            },
            include: {
                list: true,
                members: true,
            }
        })

        if (!group.list.some(list => list.anime_id == anime_id)) {
            throw new BaseError('no_anime_in_list', { status: RequestStatuses.UnprocessableContent });
        }

        await prisma.group_anime_list.deleteMany({
            where: {
                anime_id, group_id
            }
        })

        const members = group.members.filter(member => member.override_list);
        const memberIds = members.map(user => user.user_id)

        await prisma.anime_list.deleteMany({
            where: {
                anime_id,
                user_id: {
                    in: memberIds
                }
            }
        })
    }

    private static async updateMembers(group: GroupWithMembers, data: AddWithAnime) {
        const { anime_id, is_favorite, rating, status, watched_episodes } = data;
        const members = group.members.filter(member => member.override_list);
        const memberIds = members.map(user => user.user_id)

        const membersListEntries = await prisma.anime_list.findMany({
            where: {
                user_id: {
                    in: memberIds,
                },
                anime_id
            }
        })
        const membersWithListEntries: number[] = membersListEntries.map(list => list.user_id);
        const membersWithoutListEntries: number[] = memberIds.filter(id => membersWithListEntries.indexOf(id) === -1);

        await prisma.anime_list.updateMany({
            where: {
                anime_id,
                user_id: {
                    in: membersWithListEntries
                }
            },
            data: {
                is_favorite,
                rating,
                status,
                watched_episodes
            }
        })

        for (const id of membersWithoutListEntries) {
            await prisma.anime_list.create({
                data: {
                    anime_id,
                    is_favorite,
                    status,
                    watched_episodes,
                    rating,
                    user_id: id
                }
            })
        }
    }
}