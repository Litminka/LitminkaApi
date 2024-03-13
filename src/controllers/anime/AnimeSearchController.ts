import { Request, Response } from "express";
import { RequestStatuses } from "../../ts/enums";
import AnimeFilterService from "../../services/filters/AnimeSearchFilter";

export default class SearchController {
    public static async getAnime(req: Request, res: Response) {
        const anime = await AnimeFilterService.filterSelector(req.body)
        return res.json(anime)
    }
}
