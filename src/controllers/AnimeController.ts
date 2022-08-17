import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { prisma } from "../db";
import ShikimoriApi from "../helper/shikimoriapi";
import { RequestWithAuth, ServerError, ShikimoriAnimeFull } from "../ts/custom";
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
        if ((anime?.description != null && anime?.rpa_rating != null)) return res.json({
            body: anime
        });
        const shikimoriApi = new ShikimoriApi(user!);
        const resAnime: ShikimoriAnimeFull | ServerError = await shikimoriApi.getAnimeById(anime!.shikimori_id);
        if (resAnime.reqStatus !== 500 && resAnime.reqStatus !== 404) {
            const update = resAnime as ShikimoriAnimeFull;
            await prisma.anime.update({
                where: {
                    id: anime!.id
                },
                data: {
                    shikimori_score: parseFloat(update.score),
                    description: update.description,
                    japanese_name: update.japanese ? update.japanese[0] : null,
                    franchise_name: update.franchise,
                    rpa_rating: update.rating,
                    genres: {
                        connectOrCreate: update.genres.map((genre) => {
                            return {
                                where: {
                                    name: genre.russian
                                },
                                create: {
                                    name: genre.russian
                                }
                            }
                        }),
                    }
                }
            });
            anime = await prisma.anime.findFirst({
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
        }
        return res.json({
            body: anime
        });
    }
}