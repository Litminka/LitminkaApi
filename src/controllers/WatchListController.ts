import { Request, Response } from "express";
import { prisma } from '../db';
import { AddToList, RequestWithAuth, ServerError, ShikimoriAnime, ShikimoriWatchList } from "../ts/index";
import { RequestStatuses } from "../ts/enums";
import User from "../models/User";
import WatchListService from "../services/WatchListService";
import AnimeList from "../models/AnimeList";
import BadRequestError from "../errors/clienterrors/BadRequestError";
import NotFoundError from "../errors/clienterrors/NotFoundError";

export default class WatchListController {
    // FIXME: get out in middleware
    public static async getWatchList(req: RequestWithAuth, res: Response): Promise<Object> {
        const { id } = req.auth!;
        const user = await User.getUserByIdAnimeList(id);
        return res.json(user.anime_list);
    }

    public static async importList(req: RequestWithAuth, res: Response): Promise<any> {
        const { id } = req.auth!;
        await WatchListService.importListByUserId(id);
        return res.json({
            message: 'List imported successfully'
        });
    }

    public static async addToList(req: RequestWithAuth, res: Response) {
        const addingParameters = req.body as AddToList
        const { id } = req.auth!;
        const anime_id: number =  req.params.anime_id as unknown as number;
        const anime_list = await WatchListService.addAnimeToListByIdWithParams(id, anime_id, addingParameters);
        return res.json({
            data: anime_list
        });
    }

    public static async editList(req: RequestWithAuth, res: Response) {
        const editParameters = req.body as AddToList
        const { id } = req.auth!;
        const anime_id: number = req.params.anime_id as unknown as number;
        const anime_list = await WatchListService.editAnimeListByIdWithParams(id, anime_id, editParameters);;
        return res.json({
            data: anime_list
        });
    }

    public static async deleteFromList(req: RequestWithAuth, res: Response) {
        const { id } = req.auth!;
        const anime_id = req.params.anime_id as unknown as number;
        await WatchListService.removeAnimeFromList(id, anime_id);
        return res.json({
            message: "Entry deleted successfully"
        });
    }
}