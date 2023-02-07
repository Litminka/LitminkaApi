import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { prisma } from "../db";
import ShikimoriApi from "../helper/shikimoriapi";
import AnimeUpdateService from "../services/AnimeUpdateService";
import { RequestWithAuth, ServerError, ShikimoriAnimeFull } from "../ts/index";


export default class AnimeController {
    public static async getSingleAnime(req: RequestWithAuth, res: Response) {
        const result = validationResult(req);
        if (!result.isEmpty()) return res.status(404).json({ message: "This anime doesn't exist" });
        const user = await prisma.user.findFirst({
            where: {
                id: req.auth?.id,
            },
            include: {
                integration: true,
                shikimori_link: true,
            }
        })
        const anime_id: number = req.params.anime_id as unknown as number;
        let anime = await prisma.anime.findFirst({
            where: { id: anime_id },
            include: {
                genres: true,
                anime_translations: {
                    include: {
                        group: true
                    }
                }
            }
        });
        if (!anime) return res.status(404).json({ message: "This anime doesn't exist" });
        if (!user) return res.json({
            body: anime
        });
        // TODO: add user role checking, and setting checking to allow shikimori requests only to specific users
        if ((anime.description != null && anime.rpa_rating != null)) return res.json({
            body: anime
        });
        const shikimoriApi = new ShikimoriApi(user);
        const animeUpdateService = new AnimeUpdateService(shikimoriApi, user);
        const updated = await animeUpdateService.update(anime);
        if (updated) {
            anime = await prisma.anime.findFirst({
                where: { id: anime.id },
                include: {
                    genres: true,
                    anime_translations: {
                        include: {
                            group: true
                        }
                    }
                }
            });
        }
        return res.json({
            body: anime
        });
    }
}