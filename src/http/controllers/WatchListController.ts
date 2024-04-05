import { Response } from "express";
import { RequestWithUserAnimeList, watchListStatus, ListFilters } from "@/ts/index";
import WatchListService from "@services/WatchListService";
import { IntegrationReq } from "@requests/IntegrationRequest";
import { AddToWatchListReq } from "@requests/watchList/AddToWatchListRequest";
import { EditWatchListReq } from "@requests/watchList/EditWatchListRequest";
import { DeleteFromWatchListReq } from "@requests/watchList/DeleteFromWatchListRequest";

export default class WatchListController {
    public static async getWatchList(req: RequestWithUserAnimeList, res: Response): Promise<Object> {
        const user = req.auth.user;
        const statuses: watchListStatus[] = req.body.statuses as watchListStatus[];
        const ratings: number[] = req.body.ratings as number[];
        const isFavorite: boolean = req.body.isFavorite as boolean;

        const filteredWatchList = await WatchListService.getFilteredWatchList(user, { statuses, ratings, isFavorite } as ListFilters)

        return res.json(filteredWatchList);
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

        const animeList = await WatchListService.addAnimeToListWithParams(user, animeId, addParameters);
        return res.json({
            data: animeList
        });
    }

    public static async editList(req: EditWatchListReq, res: Response) {
        const user = req.auth.user;

        const editParameters = req.body;
        const animeId = req.params.animeId;

        const animeList = await WatchListService.editAnimeListWithParams(user, animeId, editParameters);
        return res.json({
            data: animeList
        });
    }

    public static async deleteFromList(req: DeleteFromWatchListReq, res: Response) {
        const user = req.auth.user;

        const animeId = req.params.animeId;

        await WatchListService.removeAnimeFromList(user, animeId);
        return res.json({
            message: "Entry deleted successfully"
        });
    }
}