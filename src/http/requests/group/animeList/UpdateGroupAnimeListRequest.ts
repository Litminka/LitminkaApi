import prisma from '@/db';
import { ValidationChain } from 'express-validator';
import { minmax } from '@/ts';
import GroupRequest from '@requests/group/GroupRequest';
import { WatchListStatuses } from '@enums';
import {
    bodyStringValidator,
    bodyIntValidator,
    bodyBoolValidator
} from '@/validators/BodyBaseValidator';
import { paramIntValidator } from '@/validators/ParamBaseValidator';

export default class UpdateGroupAnimeListRequest extends GroupRequest {
    public params!: {
        animeId: number;
        groupId: number;
    };
    public body!: {
        status: WatchListStatuses;
        watchedEpisodes: number;
        rating: number;
        isFavorite: boolean;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        const watchedRange: minmax = { min: 0 };
        return [
            paramIntValidator('groupId'),
            paramIntValidator('animeId').custom(async (value) => {
                const anime = await prisma.anime.findFirst({
                    where: { id: value }
                });
                if (!anime) throw new Error("Anime doesn't exist");
                watchedRange.max = anime.maxEpisodes;
            }),
            bodyStringValidator('status').isIn(Object.values(WatchListStatuses)),
            bodyIntValidator('watchedEpisodes', {
                typeParams: watchedRange
            }),

            bodyIntValidator('rating', {
                typeParams: { min: 0, max: 10 }
            }),

            bodyBoolValidator('isFavorite')
        ];
    }
}

export const updateGroupAnimeListReq = new UpdateGroupAnimeListRequest().send();
