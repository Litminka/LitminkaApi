import { Anime_translation } from "@prisma/client";
import { FollowAnime, followType, info } from "../ts/index";
import { AnimeStatuses, FollowTypes } from "../ts/enums";
import FollowModel from "../models/Follow";
import UnprocessableContentError from "../errors/clienterrors/UnprocessableContentError";
import User from "../models/User";
import AnimeModel from "../models/Anime";
type follows = {
    anime: {
        shikimori_id: number;
    };
    translation?: Anime_translation | null;
    user_id: number;
    status: string;
}[]


export default class FollowService {

    public getFollowsMap(follows: follows): Map<number, followType> {
        const followsMap = new Map<number, followType>()
        for (const follow of follows) {
            if (followsMap.has(follow.anime.shikimori_id)) {
                const element = followsMap.get(follow.anime.shikimori_id);
                const { translation, user_id } = follow;
                if (translation) {
                    element!.info.push({    
                        translation,
                        user_id
                    });
                    continue;
                }
                element!.info.push({
                    user_id
                });
                continue;
            }
            const { anime, user_id, status, translation } = follow;
            const info: info = {
                user_id
            }
            if (translation) info.translation = translation
            const newFollow: followType = {
                anime, info: [info], status,
            }
            followsMap.set(follow.anime.shikimori_id, newFollow);
        }
        return followsMap;
    }

    private static async followUpdate(status: FollowTypes, anime_id: number, user_id: number, translation_id?: number, translation_group_name? :string ){
        const followAnime: FollowAnime = {anime_id, user_id, status, translation_id, translation_group_name}
        const follow = await FollowModel.findFollow(followAnime)
        if (follow) throw new UnprocessableContentError(`This anime is already followed as \"${status}\"`);
        await User.followAnime(followAnime);
    }

    public static async follow(anime_id: number, user_id: number, type: FollowTypes, group_name: string){
        const anime = await AnimeModel.findWithTranlsations(anime_id);
        if (type === FollowTypes.Follow) {
            const translation = anime.anime_translations.find(anime => anime.group.name == group_name)
            if (translation === undefined) 
                throw new UnprocessableContentError("This anime doesn't have given group");
            if (anime.current_episodes >= anime.max_episodes && anime.current_episodes === translation.current_episodes) {
                throw new UnprocessableContentError("Can't follow non ongoing anime");
            }
            await FollowService.followUpdate(FollowTypes.Follow, anime.id, user_id, translation.id, translation.group.name);
        }
        if (type === FollowTypes.Announcement) {
            if (anime.status !== AnimeStatuses.Announced)
                throw new UnprocessableContentError("Can't follow non announced anime");
            await FollowService.followUpdate(FollowTypes.Announcement, anime.id, user_id);
        }
    }

    public static async unfollow(anime_id: number, user_id: number, group_name?: string){
        const anime = await AnimeModel.findWithTranlsations(anime_id);
        let unfollow: FollowAnime = {user_id, anime_id} as FollowAnime;
        if (!group_name) {
            return await FollowModel.removeFollow(unfollow);
        }
        const translation = anime.anime_translations.find(anime => anime.group.name == group_name);
        if (translation === undefined) throw new UnprocessableContentError("This anime doesn't have given group");
        unfollow.translation_id = translation.id;
        return await FollowModel.removeFollow(unfollow)
    }

}