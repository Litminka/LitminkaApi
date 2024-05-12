import { Response } from 'express';
import WatchListService from '@services/WatchListService';
import IntegrationRequest from '@requests/IntegrationRequest';
import AddToWatchListRequest from '@requests/watchList/AddToWatchListRequest';
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
        const statuses = req.body.statuses;
        const ratings = req.body.ratings;
        const isFavorite = req.body.isFavorite;
        const query = req.query;

        const list = await WatchListService.get(userId, { statuses, ratings, isFavorite }, query);
        const listCount = await WatchListService.getCount(userId, {
            statuses,
            ratings,
            isFavorite
        });

        return res.status(RequestStatuses.OK).json({ count: listCount, body: list });
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
     * Add entry to watchlist
     * @param req
     * @param res
     * @returns Response
     */
    public static async add(req: AddToWatchListRequest, res: Response) {
        const user = req.user;

        const addParameters = req.body;
        const animeId = req.params.animeId;

        const animeList = await WatchListService.add(user, animeId, addParameters);
        return res.status(RequestStatuses.Created).json({ body: animeList });
    }

    /**
     * Update entry in watchlist
     * @param req
     * @param res
     * @returns
     */
    public static async update(req: EditWatchListRequest, res: Response) {
        const user = req.user;

        const editParameters = req.body;
        const animeId = req.params.animeId;

        const animeList = await WatchListService.update(user, animeId, editParameters);
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
