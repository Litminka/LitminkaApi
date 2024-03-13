import { validateParamId } from "./BaseValidator";

export const AnimeValidation = (): any[] => {
    return [
        validateParamId('animeId')
    ]
};
