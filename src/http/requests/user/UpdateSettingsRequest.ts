import { ValidationChain } from 'express-validator';
import {
    bodyBoolValidator,
    bodyIntValidator,
    bodyStringValidator
} from '@/validators/BodyBaseValidator';
import IntegrationRequest from '@requests/IntegrationRequest';

export default class UpdateSettingsRequest extends IntegrationRequest {
    public body!: {
        siteTheme?: string;
        watchListMode?: string;
        watchListAddAfterEpisodes?: number;
        watchListAskAboutRating?: boolean;
        watchListAutoAdd?: boolean;
        watchListUnsubAfterDrop?: boolean;
        watchListIgnoreOptionForLessEpisodes?: boolean;
        watchListWatchedPercentage?: number;
        showCensoredContent?: boolean;
        shikimoriExportList?: boolean;
        notifyDiscord?: boolean;
        notifyTelegram?: boolean;
        notifyVK?: boolean;
        notifyPush?: boolean;
    };

    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {
        return [
            bodyStringValidator('watchListMode').isIn(['auto', 'manual']).optional(),
            bodyIntValidator('watchListAddAfterEpisodes').optional(),
            bodyIntValidator('watchListWatchedPercentage', {
                typeParams: { min: 0, max: 100 }
            }).optional(),
            bodyBoolValidator('watchListAskAboutRating').optional(),
            bodyBoolValidator('watchListUnsubAfterDrop').optional(),
            bodyBoolValidator('watchListAutoAdd').optional(),
            bodyBoolValidator('watchListIgnoreOptionForLessEpisodes').optional(),
            bodyBoolValidator('showCensoredContent').optional(),
            bodyBoolValidator('shikimoriExportList').optional(),
            bodyBoolValidator('notifyDiscord').optional(),
            bodyBoolValidator('notifyTelegram').optional(),
            bodyBoolValidator('notifyVK').optional(),
            bodyBoolValidator('notifyPush').optional(),
            bodyStringValidator('siteTheme').isIn(['light', 'dark']).optional()
        ];
    }
}

export const updateSettingsReq = new UpdateSettingsRequest().send();
