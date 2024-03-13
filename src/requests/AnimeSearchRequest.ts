import { RequestAuthTypes } from "../ts/enums";
import Request from "./Request";
import {
    genresValidator,
    seasonsValidator,
    nameValidator,
    statusesValidator,
    rpaRatingsValidator,
    mediaTypesValidator
} from "../validators/AnimeValidator";
import { softPeriodValidator } from "../validators/PeriodValidator";

export default class SearchAnimeRequest extends Request {

    /**
     * Define auth type for this request
     */
    protected authType = RequestAuthTypes.Optional;

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
        ]
    }
}