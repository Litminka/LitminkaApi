import { Request, Response } from "express";
import { RequestStatuses } from "../ts/enums";
import { AnimeFilterSelector } from "../services/AnimeFilterService";

export default class SearchController {
    public static async getAnime(req: Request, res: Response) {
        const selector = new AnimeFilterSelector()

        const anime = await selector.filter(req.body)

        return res.json(anime)
    }
}
