import { Response } from "express";
import { RequestUserWithIntegration } from "../../ts/index";
import AnimeService from "../../services/anime/AnimeService";
import { RequestStatuses } from "../../ts/enums";


export default class AnimeController {
    public static async getSingleAnime(req: RequestUserWithIntegration, res: Response) {
        const user = req.auth.user;
        const animeId: number = req.params.animeId as unknown as number;

        const anime = await AnimeService.getSingleAnime(animeId, user);

        return res.status(RequestStatuses.OK).json({
            body: anime
        });
    }
}