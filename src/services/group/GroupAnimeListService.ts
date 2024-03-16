import { GroupList, GroupListMembers } from "@prisma/client"
import prisma from "@/db"
import BaseError from "@errors/BaseError"
import { AddWithAnime } from "@/ts"
import { RequestStatuses } from "@/ts/enums"

interface AddToGroupList {
    userId: number,
    groupId: number,
    data: AddWithAnime
}

interface DeleteFromGroupList {
    userId: number,
    groupId: number,
    animeId: number
}

type GroupWithMembers = GroupList & {
    members: GroupListMembers[]
}

export default class GroupAnimeListService {
    public static async get(userId: number, groupId: number) {
        await prisma.groupListMembers.findFirstOrThrow({
            where: {
                AND: {
                    groupId,
                    userId
                }
            }
        })

        return await prisma.groupAnimeList.findMany({
            where: {
                groupId
            },
            include: {
                anime: true,
            }
        })
    }

    public static async add({ userId, groupId, data }: AddToGroupList) {
        const group = await prisma.groupList.findFirstOrThrow({
            where: {
                id: groupId,
                ownerId: userId
            },
            include: {
                list: true,
                members: true,
            }
        })

        if (group.list.some(list => list.animeId == data.animeId)) {
            throw new BaseError('anime_already_in_list', { status: RequestStatuses.UnprocessableContent });
        }

        await GroupAnimeListService.updateMembers(group, data);

        const { animeId, isFavorite, rating, status, watchedEpisodes } = data;
        return await prisma.groupAnimeList.create({
            data: {
                groupId,
                animeId,
                isFavorite,
                rating,
                status,
                watchedEpisodes
            }
        })
    }

    public static async update({ userId, groupId, data }: AddToGroupList) {
        const group = await prisma.groupList.findFirstOrThrow({
            where: {
                id: groupId,
                ownerId: userId
            },
            include: {
                list: true,
                members: true,
            }
        })

        if (!group.list.some(list => list.animeId == data.animeId)) {
            throw new BaseError('no_anime_in_list', { status: RequestStatuses.UnprocessableContent });
        }

        await GroupAnimeListService.updateMembers(group, data);

        const { animeId, isFavorite, rating, status, watchedEpisodes } = data;
        await prisma.groupAnimeList.updateMany({
            where: {
                animeId, groupId
            },
            data: {
                groupId,
                isFavorite,
                rating,
                status,
                watchedEpisodes
            }
        })


    }

    public static async delete({ userId, groupId, animeId }: DeleteFromGroupList) {
        const group = await prisma.groupList.findFirstOrThrow({
            where: {
                id: groupId,
                ownerId: userId
            },
            include: {
                list: true,
                members: true,
            }
        })

        if (!group.list.some(list => list.animeId == animeId)) {
            throw new BaseError('no_anime_in_list', { status: RequestStatuses.UnprocessableContent });
        }

        await prisma.groupAnimeList.deleteMany({
            where: {
                animeId, groupId
            }
        })

        const members = group.members.filter(member => member.overrideList);
        const memberIds = members.map(user => user.userId)

        await prisma.animeList.deleteMany({
            where: {
                animeId,
                userId: {
                    in: memberIds
                }
            }
        })
    }

    private static async updateMembers(group: GroupWithMembers, data: AddWithAnime) {
        const { animeId, isFavorite, rating, status, watchedEpisodes } = data;
        const members = group.members.filter(member => member.overrideList);
        const memberIds = members.map(user => user.userId)

        const membersListEntries = await prisma.animeList.findMany({
            where: {
                userId: {
                    in: memberIds,
                },
                animeId
            }
        })
        const membersWithListEntries: number[] = membersListEntries.map(list => list.userId);
        const membersWithoutListEntries: number[] = memberIds.filter(id => membersWithListEntries.indexOf(id) === -1);

        await prisma.animeList.updateMany({
            where: {
                animeId,
                userId: {
                    in: membersWithListEntries
                }
            },
            data: {
                isFavorite,
                rating,
                status,
                watchedEpisodes
            }
        })

        for (const id of membersWithoutListEntries) {
            await prisma.animeList.create({
                data: {
                    animeId,
                    isFavorite,
                    status,
                    watchedEpisodes,
                    rating,
                    userId: id
                }
            })
        }
    }
}