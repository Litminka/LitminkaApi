import { Response } from 'express';
import WatchListService from '@services/WatchListService';
import { IntegrationReq } from '@requests/IntegrationRequest';
import { AddToWatchListReq } from '@requests/watchList/AddToWatchListRequest';
import { EditWatchListReq } from '@requests/watchList/EditWatchListRequest';
import { DeleteFromWatchListReq } from '@requests/watchList/DeleteFromWatchListRequest';
import { GetWatchListReq } from '@requests/watchList/GetWatchListRequest';
import { RequestStatuses } from '@/ts/enums';

export default class WatchListController {
    public static async getWatchList(req: GetWatchListReq, res: Response): Promise<Object> {
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

    public static async importList(req: IntegrationReq, res: Response): Promise<any> {
        const user = req.auth.user;

        WatchListService.startImport(user);

        return res.json({
            message: 'started_list_import'
        });
    }

    public static async addToList(req: AddToWatchListReq, res: Response) {
        const user = req.auth.user;

        const addParameters = req.body;
        const animeId = req.params.animeId;

        const animeList = await WatchListService.add(user, animeId, addParameters);
        return res.json({
            data: animeList
        });
    }

    public static async editList(req: EditWatchListReq, res: Response) {
        const user = req.auth.user;

        const editParameters = req.body;
        const animeId = req.params.animeId;

        const animeList = await WatchListService.update(user, animeId, editParameters);
        return res.json({
            data: animeList
        });
    }

    public static async deleteFromList(req: DeleteFromWatchListReq, res: Response) {
        const user = req.auth.user;

        const animeId = req.params.animeId;

        await WatchListService.removeAnimeFromList(user, animeId);
        return res.json({
            message: 'Entry deleted successfully'
        });
    }
}
