
import NotFoundError from "../errors/clienterrors/NotFoundError";
import AnimeModel from "../models/Anime";
import User from "../models/User";
import AnimeUpdateService from "./AnimeUpdateService";
import ShikimoriApiService from "./ShikimoriApiService";

export default class AnimeService {
    public static async getSingleAnime(user_id: number, anime_id: number){
        const user = await User.findUserByIdWithIntegration(user_id);
        let anime = await AnimeModel.findWithTranlsationsAndGenres(anime_id);
        if (!anime) throw new NotFoundError("This anime doesn't exist");
        if (!user) return anime;
        // TODO: add user role checking, and setting check to allow shikimori requests only to specific users
        if ((anime.description != null && anime.rpa_rating != null)) return anime;
        const shikimoriApi = new ShikimoriApiService(user);
        const animeUpdateService = new AnimeUpdateService(shikimoriApi, user);
        const updated = await animeUpdateService.update(anime);
        if (updated) {
            anime = await AnimeModel.findWithTranlsationsAndGenres(anime_id);
        }
        return anime;
    }
}