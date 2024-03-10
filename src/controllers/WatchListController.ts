import { Response } from "express";
import { AddToList, RequestWithAuth } from "../ts/index";
import User from "../models/User";
import WatchListService from "../services/WatchListService";
import { importWatchListQueue } from "../queues/watchListImporter";

export default class WatchListController {
    // FIXME: get out in middleware
    public static async getWatchList(req: RequestWithAuth, res: Response): Promise<Object> {
        const { id } = req.auth!;

        const user = await User.getUserByIdAnimeList(id);

        return res.json(user.animeList);
    }

    public static async importList(req: RequestWithAuth, res: Response): Promise<any> {
        const { id } = req.auth!;

        importWatchListQueue.add("importWatchListImport", { id }, {
            removeOnComplete: 10,
            removeOnFail: 100
        })

        return res.json({
            message: 'List imported successfully'
        });
    }

    public static async addToList(req: RequestWithAuth, res: Response) {
        const addingParameters = req.body as AddToList
        const { id } = req.auth!;
        const animeId: number = req.params.animeId as unknown as number;
        const animeList = await WatchListService.addAnimeToListByIdWithParams(id, animeId, addingParameters);
        return res.json({
            data: animeList
        });
    }

    public static async editList(req: RequestWithAuth, res: Response) {
        const editParameters = req.body as AddToList
        const { id } = req.auth!;
        const animeId: number = req.params.animeId as unknown as number;
        const animeList = await WatchListService.editAnimeListByIdWithParams(id, animeId, editParameters);;
        return res.json({
            data: animeList
        });
    }

    public static async deleteFromList(req: RequestWithAuth, res: Response) {
        const { id } = req.auth!;
        const animeId = req.params.animeId as unknown as number;
        await WatchListService.removeAnimeFromList(id, animeId);
        return res.json({
            message: "Entry deleted successfully"
        });
    }
}