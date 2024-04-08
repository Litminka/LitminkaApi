import { GroupList, GroupListMembers, Prisma } from '@prisma/client';
import prisma from '@/db';
import BaseError from '@errors/BaseError';
import { AddWithAnime, ListFilters, PaginationQuery } from '@/ts';
import { RequestStatuses } from '@/ts/enums';
import ShikimoriListSyncService from '@services/shikimori/ShikimoriListSyncService';

interface AddToGroupList {
    userId: number;
    groupId: number;
    data: AddWithAnime;
}

interface DeleteFromGroupList {
    userId: number;
    groupId: number;
    animeId: number;
}

type GroupWithMembers = GroupList & {
    members: GroupListMembers[];
};

export default class GroupAnimeListService {
    private static getFilters(groupId: number, filters: ListFilters) {
        const { statuses, ratings, isFavorite } = filters as ListFilters;
        const { filter } = {
            filter: () => ({
                AND: {
                    groupId,
                    isFavorite,
                    status: statuses === undefined ? undefined : { in: statuses },
                    rating:
                        ratings === undefined
                            ? undefined
                            : {
                                  gte: ratings ? ratings[0] : 1,
                                  lte: ratings ? ratings[1] : 10
                              }
                }
            })
        } satisfies Record<string, (...args: any) => Prisma.GroupAnimeListWhereInput>;
        return filter();
    }

    public static async getCount(groupId: number, filters: ListFilters) {
        const { _count } = await prisma.groupAnimeList.aggregate({
            _count: {
                id: true
            },
            where: this.getFilters(groupId, filters)
        });
        return _count.id;
    }

    public static async get(
        userId: number,
        groupId: number,
        filters: ListFilters,
        query: PaginationQuery
    ) {
        await prisma.groupListMembers.findFirstOrThrow({
            where: {
                AND: {
                    groupId,
                    userId
                }
            }
        });
        return await prisma.groupAnimeList.findMany({
            take: query.pageLimit,
            skip: (query.page - 1) * query.pageLimit,
            where: this.getFilters(groupId, filters),
            include: {
                anime: true
            }
        });
    }

    public static async add({ userId, groupId, data }: AddToGroupList) {
        const group = await prisma.groupList.findFirstOrThrow({
            where: {
                id: groupId,
                ownerId: userId
            },
            include: {
                list: true,
                members: true
            }
        });

        if (group.list.some((list) => list.animeId == data.animeId)) {
            throw new BaseError('anime_already_in_list', {
                status: RequestStatuses.UnprocessableContent
            });
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
        });
    }

    public static async update({ userId, groupId, data }: AddToGroupList) {
        const group = await prisma.groupList.findFirstOrThrow({
            where: {
                id: groupId,
                ownerId: userId
            },
            include: {
                list: true,
                members: true
            }
        });

        if (!group.list.some((list) => list.animeId == data.animeId)) {
            throw new BaseError('no_anime_in_list', {
                status: RequestStatuses.UnprocessableContent
            });
        }

        await GroupAnimeListService.updateMembers(group, data);

        const { animeId, isFavorite, rating, status, watchedEpisodes } = data;
        await prisma.groupAnimeList.updateMany({
            where: {
                animeId,
                groupId
            },
            data: {
                groupId,
                isFavorite,
                rating,
                status,
                watchedEpisodes
            }
        });
    }

    public static async delete({ userId, groupId, animeId }: DeleteFromGroupList) {
        const group = await prisma.groupList.findFirstOrThrow({
            where: {
                id: groupId,
                ownerId: userId
            },
            include: {
                list: true,
                members: true
            }
        });

        if (!group.list.some((list) => list.animeId == animeId)) {
            throw new BaseError('no_anime_in_list', {
                status: RequestStatuses.UnprocessableContent
            });
        }

        await prisma.groupAnimeList.deleteMany({
            where: {
                animeId,
                groupId
            }
        });

        const members = group.members.filter((member) => member.overrideList);
        const memberIds = members.map((user) => user.userId);

        const userListEntries = await prisma.animeList.findMany({
            where: {
                animeId,
                userId: {
                    in: memberIds
                }
            }
        });
        const memberIntegrations = await prisma.user.findMany({
            where: {
                id: {
                    in: memberIds
                }
            },
            include: {
                integration: true,
                settings: true
            }
        });

        for (const entry of userListEntries) {
            if (!entry.shikimoriId) continue;
            const user = memberIntegrations.find((user) => user.id === entry.userId);
            if (!user) continue;
            ShikimoriListSyncService.createDeleteJob(user, entry.shikimoriId);
        }

        await prisma.animeList.deleteMany({
            where: {
                animeId,
                userId: {
                    in: memberIds
                }
            }
        });
    }

    private static async updateMembers(group: GroupWithMembers, data: AddWithAnime) {
        const { animeId, isFavorite, rating, status, watchedEpisodes } = data;

        const { shikimoriId } = await prisma.anime.findFirstOrThrow({
            where: {
                id: animeId
            },
            select: {
                shikimoriId: true
            }
        });

        const members = group.members.filter((member) => member.overrideList);
        const memberIds = members.map((user) => user.userId);

        const membersListEntries = await prisma.animeList.findMany({
            where: {
                userId: {
                    in: memberIds
                },
                animeId
            }
        });

        const membersWithListEntries: number[] = membersListEntries.map((list) => list.userId);
        const membersWithoutListEntries: number[] = memberIds.filter(
            (id) => membersWithListEntries.indexOf(id) === -1
        );

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
        });

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
            });
        }

        const membersWithIntegrations = await prisma.user.findMany({
            where: {
                id: {
                    in: memberIds
                }
            },
            include: {
                integration: true,
                settings: true
            }
        });

        for (const user of membersWithIntegrations) {
            ShikimoriListSyncService.createAddUpdateJob(user, {
                animeId: shikimoriId,
                episodes: watchedEpisodes,
                status,
                score: rating === 0 ? undefined : rating
            });
        }
    }
}
