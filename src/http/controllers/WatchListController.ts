import { Response } from 'express';
import WatchListService from '@services/WatchListService';
import { IntegrationReq } from '@requests/IntegrationRequest';
import { AddToWatchListReq } from '@requests/watchList/AddToWatchListRequest';
import { EditWatchListReq } from '@requests/watchList/EditWatchListRequest';
import { DeleteFromWatchListReq } from '@requests/watchList/DeleteFromWatchListRequest';
import { GetWatchListReq } from '@requests/watchList/GetWatchListRequest';
import { RequestStatuses } from '@enums';

export default class WatchListController {
    /**
     * Get watchlist
     * @param req
     * @param res
     * @returns
     */
    public static async get(req: GetWatchListReq, res: Response) {
        const userId = req.auth.user.id;
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
    public static async startImport(req: IntegrationReq, res: Response) {
        const user = req.auth.user;

        WatchListService.startImport(user);

        return res.status(RequestStatuses.Accepted);
    }

    /**
     * Add entry to watchlist
     * @param req
     * @param res
     * @returns Response
     */
    public static async add(req: AddToWatchListReq, res: Response) {
        const user = req.auth.user;

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
    public static async update(req: EditWatchListReq, res: Response) {
        const user = req.auth.user;

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
    public static async delete(req: DeleteFromWatchListReq, res: Response) {
        const user = req.auth.user;

        const animeId = req.params.animeId;

        await WatchListService.delete(user, animeId);
        return res.status(RequestStatuses.Accepted);
    }
}
