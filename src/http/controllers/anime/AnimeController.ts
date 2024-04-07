import { Response } from "express";
import AnimeService from "@services/anime/AnimeService";
import { Permissions, RequestStatuses } from "@/ts/enums";
import AnimeSearchService from "@services/anime/AnimeSearchService";
import { GetSingleAnimeReq } from "@requests/anime/GetSingleAnimeRequest";
import { GetAnimeReq } from "@requests/anime/GetAnimeRequest";
import { BanAnimeReq } from "@requests/anime/BanAnimeRequest";
import { GetTopAnimeReq } from "@requests/anime/GetTopAnimeRequest";
import { FrontPageAnimeReq } from "@/http/requests/anime/FrontPageAnimeRequest";
import hasPermissions from "@/helper/hasPermission";

export default class AnimeController {
    public static async getSingleAnime(req: GetSingleAnimeReq, res: Response) {
        const user = req.auth?.user;
        const animeId = req.params.animeId;

        const anime = await AnimeService.getSingleAnime(animeId, user);

        return res.status(RequestStatuses.OK).json({
            body: anime
        });
    }

    public static async getAnime(req: GetAnimeReq, res: Response) {
        const query = req.query;
        const body = req.body;
        const showBanned = hasPermissions([Permissions.ManageAnime], req.auth?.user);
        body.banInRussia = showBanned;

        const count = await AnimeSearchService.getFilteredCount(body);
        const anime = await AnimeSearchService.filterSelector(body, query)
        return res.status(RequestStatuses.OK).json({
            count: count.id,
            body: anime
        });
    }

    public static async getTopAnime(req: GetTopAnimeReq, res: Response) {
        const shikimori = req.body.shikimori

        const top = await AnimeService.getTopAnime(shikimori)

        return res.status(RequestStatuses.OK).json(top)
    }

    public static async banAnime(req: BanAnimeReq, res: Response) {
        const animeId = req.params.animeId;

        await AnimeService.banAnime(animeId);

        return res.status(RequestStatuses.OK).json({
            message: "anime_banned"
        })
    }

    public static async unBanAnime(req: BanAnimeReq, res: Response) {
        const animeId = req.params.animeId;

        await AnimeService.unBanAnime(animeId);

        return res.status(RequestStatuses.OK).json({
            message: "anime_unbanned"
        })
    }

    public static async getSeasonal(req: FrontPageAnimeReq, res: Response) {
        const withCensored = req.body.withCensored;
        const showBanned = hasPermissions([Permissions.ManageAnime], req.auth?.user);

        const anime = await AnimeService.getSeasonal(withCensored, showBanned);

        return res.status(RequestStatuses.OK).json({ data: anime });
    }

    public static async getPopularSeasonal(req: FrontPageAnimeReq, res: Response) {
        const withCensored = req.body.withCensored;
        const showBanned = hasPermissions([Permissions.ManageAnime], req.auth?.user);

        const anime = await AnimeService.getPopularSeasonal(withCensored, showBanned);

        return res.status(RequestStatuses.OK).json({ data: anime });
    }

    public static async getNextSeasonAnnounced(req: FrontPageAnimeReq, res: Response) {
        const withCensored = req.body.withCensored;
        const showBanned = hasPermissions([Permissions.ManageAnime], req.auth?.user);

        const anime = await AnimeService.getNextSeasonAnnounced(withCensored, showBanned);

        return res.status(RequestStatuses.OK).json({ data: anime });
    }
}