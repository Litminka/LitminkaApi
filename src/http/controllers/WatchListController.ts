import { Response } from 'express';
import WatchListService from '@services/WatchListService';
import IntegrationRequest from '@requests/IntegrationRequest';
import EditWatchListRequest from '@requests/watchList/EditWatchListRequest';
import DeleteFromWatchListRequest from '@requests/watchList/DeleteFromWatchListRequest';
import GetWatchListRequest from '@requests/watchList/GetWatchListRequest';
import { RequestStatuses } from '@enums';

export default class WatchListController {
    /**
     * Get watchlist
     * @param req
     * @param res
     * @returns
     */
    public static async get(req: GetWatchListRequest, res: Response) {
        const userId = req.user.id;
        const statuses = req.query.statuses;
        const ratings = req.query.ratings;
        const isFavorite = req.query.isFavorite;
        const pagination = {
            page: req.query.page,
            pageLimit: req.query.pageLimit
        };

        const list = await WatchListService.get(
            userId,
            { statuses, ratings, isFavorite },
            pagination
        );

        return res.status(RequestStatuses.OK).json({ body: list });
    }

    /**
     * Import watchlist from Shikimori
     * @param req
     * @param res
     * @returns
     */
    public static async startImport(req: IntegrationRequest, res: Response) {
        const user = req.user;

        WatchListService.startImport(user);

        return res.status(RequestStatuses.Accepted).json();
    }

    /**
     * Edit entry in watchlist
     * @param req
     * @param res
     * @returns
     */
    public static async edit(req: EditWatchListRequest, res: Response) {
        const user = req.user;

        const editParameters = req.body;
        const animeId = req.params.animeId;

        const animeList = await WatchListService.edit(user, animeId, editParameters);
        return res.status(RequestStatuses.Accepted).json({ body: animeList });
    }

    /**
     * Delete entry from watchlist
     * @param req
     * @param res
     * @returns
     */
    public static async delete(req: DeleteFromWatchListRequest, res: Response) {
        const user = req.user;

        const animeId = req.params.animeId;

        await WatchListService.delete(user, animeId);
        return res.status(RequestStatuses.Accepted).json();
    }
}
