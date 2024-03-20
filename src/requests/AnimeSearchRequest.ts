import { RequestAuthTypes } from "@/ts/enums";
import Request from "@requests/Request";
import {
    genresValidator,
    seasonsValidator,
    nameValidator,
    bodyStatusesValidator,
    rpaRatingsValidator,
    mediaTypesValidator
} from "@validators/AnimeValidator";
import { bodySoftPeriodValidator } from "@validators/PeriodValidator";
import { queryIntValidator } from "@validators/BaseValidator";
import { validation } from "@/ts/messages"

export default class SearchAnimeRequest extends Request {

    /**
     * Define auth type for this request
     */
    protected authType = RequestAuthTypes.None;

    /**
     * define validation rules for this request
     * @returns ValidationChain
     */
    protected rules(): any[] {
        const msg = validation.errors.base
        return [
            ...
            genresValidator("includeGenres"),
            genresValidator("excludeGenres"),
            bodySoftPeriodValidator({
                fieldName: "period",
                message: msg.valueNotInRange
            }),
            seasonsValidator("seasons"),
            nameValidator("name"),
            bodyStatusesValidator("statuses"),
            rpaRatingsValidator("rpaRatings"),
            mediaTypesValidator("mediaTypes"),
            queryIntValidator({
                fieldName: "page",
                defValue: 1,
                typeParams: { min: 1 },
                message: { msg: msg.valueNotInRange, range: [1, null] }
            }),
            queryIntValidator({
                fieldName: "pageLimit",
                defValue: 25,
                typeParams: { min: 1, max: 125 },
                message: { msg: msg.valueNotInRange, range: [1, 125] }
            }),
        ]
    }
}