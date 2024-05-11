import { minmax } from '@/ts';
import prisma from '@/db';
import { paramIntValidator } from '@/validators/ParamBaseValidator';
import {
    bodyBoolValidator,
    bodyIntValidator,
    bodyStringValidator
} from '@/validators/BodyBaseValidator';
import { WatchListStatuses } from '@enums';
import { ValidationChain } from 'express-validator';
import IntegrationSettingsRequest from '@requests/IntegrationSettingsRequest';

export default class EditWatchListRequest extends IntegrationSettingsRequest {
    public params!: {
        animeId: number;
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

export const editWatchListReq = new EditWatchListRequest().send();
