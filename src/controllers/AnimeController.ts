import { Response } from "express";
import { validationResult } from "express-validator";
import { RequestWithAuth } from "../ts/index";
import NotFoundError from "../errors/clienterrors/NotFoundError";
import AnimeService from "../services/AnimeService";


export default class AnimeController {
    public static async getSingleAnime(req: RequestWithAuth, res: Response) {
        const result = validationResult(req);
        if (!result.isEmpty()) throw new NotFoundError("This anime doesn't exist");
        const user_id: number = req.auth?.id as number;
        const anime_id: number = req.params.anime_id as unknown as number;

        const anime = await AnimeService.getSingleAnime(user_id, anime_id);
        
        return res.json({
            body: anime
        });
    }
}