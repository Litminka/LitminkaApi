import { RequestAuthTypes } from "../ts/enums";
import Request from "./Request";
import {
    genresValidator,
    yearsValidator,
    seasonsValidator,
    nameValidator,
    episodeValidator,
    statusesValidator,
    rpaRatingsValidator,
    mediaTypesValidator
} from "../validators/FilterValidator";
import { softPeriodValidator } from '../validators/PeriodValidator';

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
            yearsValidator(),
            softPeriodValidator("period"),
            seasonsValidator(),
            nameValidator(),
            episodeValidator(),
            statusesValidator(),
            rpaRatingsValidator(),
            mediaTypesValidator()
        ]
    }
}