import { Request, Response } from "express";
import AnimeSearchFilter, { IAnimeFilterQuery, IAnimeFilters } from "@services/filters/AnimeSearchFilter";
import { matchedData } from "express-validator";

export default class SearchController {
    public static async getAnime(req: Request, res: Response) {
        const query = matchedData(req, { locations: ['query'] }) as IAnimeFilterQuery;
        const body = matchedData(req, { locations: ['body'] }) as IAnimeFilters;
        const anime = await AnimeSearchFilter.filterSelector(body, query)
        return res.json({
            body: anime
        });
    }
}
