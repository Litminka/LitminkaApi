import { Response, Request } from "express";
import { RequestUserWithIntegration, RequestWithUser } from "@/ts/index";
import AnimeService from "@services/anime/AnimeService";
import { RequestStatuses } from "@/ts/enums";
import AnimeSearchFilter, { IAnimeFilterQuery, IAnimeFilters } from "@/services/filters/AnimeSearchFilter";
import { matchedData } from "express-validator";


export default class AnimeController {
    public static async getSingleAnime(req: RequestUserWithIntegration, res: Response) {
        const user = req.auth.user;
        const animeId: number = req.params.animeId as unknown as number;

        const anime = await AnimeService.getSingleAnime(animeId, user);

        return res.status(RequestStatuses.OK).json({
            body: anime
        });
    }

    public static async getAnime(req: Request, res: Response) {
        const query = matchedData(req, { locations: ['query'] }) as IAnimeFilterQuery;
        const body = matchedData(req, { locations: ['body'] }) as IAnimeFilters;

        const anime = await AnimeSearchFilter.filterSelector(body, query)

        return res.status(RequestStatuses.OK).json({
            body: anime
        });
    }

    public static async getTopAnime(req: Request, res: Response) {
        const shikimori = req.body.shikimori

        const top = await AnimeService.getTopAnime(shikimori)

        return res.status(RequestStatuses.OK).json(top)
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