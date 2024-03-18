import { Response } from "express";
import { RequestUserWithIntegration, RequestWithUser } from "@/ts/index";
import AnimeService from "@services/anime/AnimeService";
import { RequestStatuses } from "@/ts/enums";


export default class AnimeController {
    public static async getSingleAnime(req: RequestUserWithIntegration, res: Response) {
        const user = req.auth.user;
        const animeId: number = req.params.animeId as unknown as number;

        const anime = await AnimeService.getSingleAnime(animeId, user);

        return res.status(RequestStatuses.OK).json({
            body: anime
        });
    }

    public static async banAnime(req: RequestWithUser, res: Response) {
        const animeId: number = req.params.animeId as unknown as number;

        await AnimeService.banAnime(animeId);

        return res.status(RequestStatuses.OK).json({
            message: "anime_banned"
        })
    }

    public static async unBanAnime(req: RequestWithUser, res: Response) {
        const animeId: number = req.params.animeId as unknown as number;

        await AnimeService.unBanAnime(animeId);

        return res.status(RequestStatuses.OK).json({
            message: "anime_unbanned"
        })
    }
}