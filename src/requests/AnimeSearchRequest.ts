import { RequestAuthTypes } from "@/ts/enums";
import Request from "@requests/Request";
import {
    genresValidator,
    seasonsValidator,
    nameValidator,
    statusesValidator,
    rpaRatingsValidator,
    mediaTypesValidator
} from "@validators/AnimeValidator";
import { softPeriodValidator } from "@validators/PeriodValidator";
import { validateQueryInt } from "@validators/BaseValidator";

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
        return [
            ...
            genresValidator("includeGenres"),
            genresValidator("excludeGenres"),
            softPeriodValidator("period"),
            seasonsValidator("seasons"),
            nameValidator("name"),
            statusesValidator("statuses"),
            rpaRatingsValidator("rpaRatings"),
            mediaTypesValidator("mediaTypes"),
            validateQueryInt({
                fieldName: "page",
                defValue: 1,
                intParams: { min: 1 },
                message: "Amount must be more than 0"
            }),
            validateQueryInt({
                fieldName: "pageLimit",
                defValue: 25,
                intParams: { min: 1, max: 125 },
                message: "Limit must be in range of 1 to 125"
            }),
        ]
    }
}