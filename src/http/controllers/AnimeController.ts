import { Response } from 'express';
import AnimeService from '@services/anime/AnimeService';
import { Permissions, RequestStatuses } from '@enums';
import AnimeSearchService from '@services/anime/AnimeSearchService';
import Request from '@requests/Request';
import GetSingleAnimeRequest from '@requests/anime/GetSingleAnimeRequest';
import GetAnimeRequest from '@requests/anime/GetAnimeRequest';
import BanAnimeRequest from '@requests/anime/BanAnimeRequest';
import GetTopAnimeRequest from '@requests/anime/GetTopAnimeRequest';
import FrontPageAnimeRequest from '@requests/anime/FrontPageAnimeRequest';
import hasPermissions from '@/helper/hasPermission';
import Sort from '@/helper/sorts';

export default class AnimeController {
    public static async getGenres(req: Request, res: Response) {
        const genres = await AnimeService.getGenres();
        return res.status(RequestStatuses.OK).json({
            body: genres
        });
    }

    public static async getSingleAnime(req: GetSingleAnimeRequest, res: Response) {
        const userId = req.user?.id;
        const slug = req.params.slug;

        const anime = await AnimeService.getSingleAnime(slug, userId);

        return res.status(RequestStatuses.OK).json({
            body: anime
        });
    }

    public static async getAnime(req: GetAnimeRequest, res: Response) {
        const pagination = {
            page: req.query.page,
            pageLimit: req.query.pageLimit
        };

        const filters = {
            name: req.query.name,
            seasons: req.query.seasons,
            statuses: req.query.statuses,
            rpaRatings: req.query.rpaRatings,
            mediaTypes: req.query.mediaTypes,
            excludeGenres: req.query.excludeGenres,
            includeGenres: req.query.includeGenres,
            period: req.query.period,
            isWatchable: req.query.isWatchable,
            withCensored: req.query.withCensored,
            withBanned: hasPermissions([Permissions.ManageAnime], req.user)
        };

        const sort = Sort.getAnimeSort({
            field: req.query.sortField,
            direction: req.query.sortDirection
        });

        const count = await AnimeSearchService.getFilteredCount(filters);
        const anime = await AnimeSearchService.filterSelector(filters, pagination, sort);
        return res.status(RequestStatuses.OK).json({
            body: {
                count,
                pagination,
                anime
            }
        });
    }

    public static async banAnime(req: BanAnimeRequest, res: Response) {
        const animeId = req.params.animeId;

        await AnimeService.banAnime(animeId);

        return res.status(RequestStatuses.Accepted).json();
    }

    public static async unBanAnime(req: BanAnimeRequest, res: Response) {
        const animeId = req.params.animeId;

        await AnimeService.unBanAnime(animeId);

        return res.status(RequestStatuses.Accepted).json();
    }

    public static async getTopAnime(req: GetTopAnimeRequest, res: Response) {
        const withCensored = req.body.withCensored;
        const shikimori = req.body.shikimori;
        const showBanned = hasPermissions([Permissions.ManageAnime], req.user);

        const anime = await AnimeService.getTopAnime(withCensored, showBanned, shikimori);

        return res.status(RequestStatuses.OK).json({ body: anime });
    }

    public static async getSeasonal(req: FrontPageAnimeRequest, res: Response) {
        const withCensored = req.body.withCensored;
        const isWatchable = req.body.isWatchable;
        const showBanned = hasPermissions([Permissions.ManageAnime], req.user);

        const anime = await AnimeService.getSeasonal(withCensored, isWatchable, showBanned);

        return res.status(RequestStatuses.OK).json({ body: anime });
    }

    public static async getPopularSeasonal(req: FrontPageAnimeRequest, res: Response) {
        const withCensored = req.body.withCensored;
        const isWatchable = req.body.isWatchable;
        const showBanned = hasPermissions([Permissions.ManageAnime], req.user);

        const anime = await AnimeService.getPopularSeasonal(withCensored, isWatchable, showBanned);

        return res.status(RequestStatuses.OK).json({ body: anime });
    }

    public static async getNextSeasonAnnounced(req: FrontPageAnimeRequest, res: Response) {
        const withCensored = req.body.withCensored;
        const showBanned = hasPermissions([Permissions.ManageAnime], req.user);

        const anime = await AnimeService.getNextSeasonAnnounced(withCensored, showBanned);

        return res.status(RequestStatuses.OK).json({ body: anime });
    }
}
