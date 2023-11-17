import { Anime_translation } from "@prisma/client";
import { followType, info } from "../ts/index";
type follows = {
    anime: {
        shikimori_id: number;
    };
    translation?: Anime_translation | null;
    user_id: number;
    status: string;
}[]


export default class FollowService {
    constructor() {

    }


    getFollowsMap(follows: follows): Map<number, followType> {
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
                element?.info.push({
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

}