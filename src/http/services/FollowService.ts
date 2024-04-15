import { AnimeTranslation } from '@prisma/client';
import { FollowType, FollowInfo } from '@/ts/follow';
import { FollowAnime } from '@/ts/follow';
import { AnimeStatuses, FollowTypes } from '@enums';
import UnprocessableContentError from '@/errors/clienterrors/UnprocessableContentError';
import prisma from '@/db';
type follows = {
    anime: {
        shikimoriId: number;
    };
    translation?: AnimeTranslation | null;
    userId: number;
    status: string;
}[];

export default class FollowService {
    public getFollowsMap(follows: follows): Map<number, FollowType> {
        const followsMap = new Map<number, FollowType>();
        for (const follow of follows) {
            if (followsMap.has(follow.anime.shikimoriId)) {
                const element = followsMap.get(follow.anime.shikimoriId);
                const { translation, userId } = follow;
                if (translation) {
                    element!.info.push({
                        translation,
                        userId
                    });
                    continue;
                }
                element!.info.push({
                    userId
                });
                continue;
            }
            const { anime, userId, status, translation } = follow;
            const followInfo: FollowInfo = {
                userId
            };
            if (translation) followInfo.translation = translation;
            const newFollow: FollowType = {
                anime,
                info: [followInfo],
                status
            };
            followsMap.set(follow.anime.shikimoriId, newFollow);
        }
        return followsMap;
    }

    private static async followUpdate(
        status: FollowTypes,
        animeId: number,
        userId: number,
        translationId?: number,
        translationGroupName?: string
    ) {
        const followAnime: FollowAnime = {
            animeId,
            userId,
            status,
            translationId,
            translationGroupName
        };
        const follow = await prisma.follow.findFollow(followAnime);
        if (follow)
            throw new UnprocessableContentError(`This anime is already followed as "${status}"`);
        await prisma.user.followAnime(followAnime);
    }

    public static async follow(
        animeId: number,
        userId: number,
        type: FollowTypes,
        groupName: string
    ) {
        const anime = await prisma.anime.findWithTranlsations(animeId);
        if (type === FollowTypes.Follow) {
            if (groupName === undefined) {
                throw new UnprocessableContentError('no_group_name_provided');
            }
            const translation = anime.animeTranslations.find((anime) => {
                return anime.group.name == groupName;
            });
            if (translation === undefined)
                throw new UnprocessableContentError("This anime doesn't have given group");
            if (
                anime.status == AnimeStatuses.Released &&
                translation.currentEpisodes >= anime.maxEpisodes
            )
                throw new UnprocessableContentError("Can't follow released anime");
            if (
                anime.currentEpisodes >= anime.maxEpisodes &&
                anime.currentEpisodes === translation.currentEpisodes
            )
                throw new UnprocessableContentError("Can't follow non ongoing anime");
            await FollowService.followUpdate(
                FollowTypes.Follow,
                anime.id,
                userId,
                translation.id,
                translation.group.name
            );
        }
        if (type === FollowTypes.Announcement) {
            if (anime.status !== AnimeStatuses.Announced)
                throw new UnprocessableContentError("Can't follow non announced anime");
            await FollowService.followUpdate(FollowTypes.Announcement, anime.id, userId);
        }
    }

    public static async unfollow(animeId: number, userId: number, groupName?: string) {
        const anime = await prisma.anime.findWithTranlsations(animeId);
        const unfollow: FollowAnime = { userId, animeId } as FollowAnime;
        if (!groupName) {
            return await prisma.follow.removeFollow(unfollow);
        }
        const translation = anime.animeTranslations.find((anime) => {
            return anime.group.name == groupName;
        });
        if (translation === undefined)
            throw new UnprocessableContentError("This anime doesn't have given group");
        unfollow.translationId = translation.id;
        return await prisma.follow.removeFollow(unfollow);
    }
}
