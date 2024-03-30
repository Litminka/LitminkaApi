import { Response } from "express";
import { AddToList, RequestUserWithIntegration, RequestWithUser, RequestWithUserAnimeList, watchListStatus, ListFilters } from "@/ts/index";
import WatchListService from "@services/WatchListService";

export default class WatchListController {
    public static async getWatchList(req: RequestWithUserAnimeList, res: Response): Promise<Object> {
        const user = req.auth.user;
        const statuses: watchListStatus[] = req.body.statuses as watchListStatus[];
        const ratings: number[] = req.body.ratings as number[];
        const isFavorite: boolean = req.body.isFavorite as boolean;

        const filteredWatchList = await WatchListService.getFilteredWatchList(user, {statuses, ratings, isFavorite} as ListFilters)
       
        return res.json(filteredWatchList);
    }

    public static async importList(req: RequestUserWithIntegration, res: Response): Promise<any> {
        const user = req.auth.user;

        WatchListService.startImport(user);

        return res.json({
            message: 'started_list_import'
        });
    }

    public static async addToList(req: RequestWithUser, res: Response) {
        const addingParameters = req.body as AddToList
        const user = req.auth.user;
        const animeId: number = req.params.animeId as unknown as number;
        const animeList = await WatchListService.addAnimeToListWithParams(user, animeId, addingParameters);
        return res.json({
            data: animeList
        });
    }

    public static async editList(req: RequestWithUser, res: Response) {
        const editParameters = req.body as AddToList
        const user = req.auth.user;
        const animeId: number = req.params.animeId as unknown as number;
        const animeList = await WatchListService.editAnimeListWithParams(user, animeId, editParameters);
        return res.json({
            data: animeList
        });
    }

    public static async deleteFromList(req: RequestWithUser, res: Response) {
        const user = req.auth.user;
        const animeId = req.params.animeId as unknown as number;
        await WatchListService.removeAnimeFromList(user, animeId);
        return res.json({
            message: "Entry deleted successfully"
        });
    }
}