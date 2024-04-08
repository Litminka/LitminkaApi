import { ValidationChain } from "express-validator";
import { bodyBoolValidator, bodyIntValidator, bodyStringValidator } from "@/validators/BodyBaseValidator";
import { IntegrationReq, IntegrationRequest } from "@requests/IntegrationRequest";

export interface UpdateSettingsReq extends IntegrationReq {
    body: {
        siteTheme?: string,
        watchListMode?: string,
        watchListAddAfterEpisodes?: number,
        watchListAskAboutRating?: boolean,
        showCensoredContent?: boolean,
        shikimoriExportList?: boolean,
        notifyDiscord?: boolean,
        notifyTelegram?: boolean,
        notifyVK?: boolean,
        notifyPush?: boolean,
    }
}

export class UpdateSettingsRequest extends IntegrationRequest {


    /**
     * Define validation rules for this request
     */
    protected rules(): ValidationChain[] {

        return [
            bodyStringValidator("watchListMode").isIn(["auto", "manual"]).optional(),
            bodyIntValidator("watchListAddAfterEpisodes").optional(),
            bodyBoolValidator("watchListAskAboutRating").optional(),
            bodyBoolValidator("showCensoredContent").optional(),
            bodyBoolValidator("shikimoriExportList").optional(),
            bodyBoolValidator("notifyDiscord").optional(),
            bodyBoolValidator("notifyTelegram").optional(),
            bodyBoolValidator("notifyVK").optional(),
            bodyBoolValidator("notifyPush").optional(),
            bodyStringValidator("siteTheme").isIn(["light", "dark"]).optional(),
        ];
    }
}