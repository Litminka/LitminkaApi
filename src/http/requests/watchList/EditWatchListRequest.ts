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
        return [
            paramIntValidator('animeId'),
            bodyStringValidator('status').isIn(Object.values(WatchListStatuses)).optional(),
            bodyIntValidator('watchedEpisodes', {
                typeParams: { min: 0 }
            }).optional(),

            bodyIntValidator('rating', {
                typeParams: { min: 0, max: 10 }
            }).optional(),

            bodyBoolValidator('isFavorite').optional()
        ];
    }
}

export const editWatchListReq = new EditWatchListRequest().send();
