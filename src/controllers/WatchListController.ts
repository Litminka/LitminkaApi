import ShikimoriApi from "../helper/shikimoriapi";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { prisma } from '../db';
import { AddToList, KodikAnime, KodikAnimeFullRequest, KodikAnimeWithTranslationsFullRequest, RequestWithAuth, ServerError, ShikimoriAnime, ShikimoriWatchList } from "../ts/index";
import groupArrSplice from "../helper/groupsplice";
import KodikApi from "../helper/kodikapi";
import AnimeUpdateService from "../services/AnimeUpdateService";

export default class WatchListController {
    public static async getWatchList(req: RequestWithAuth, res: Response): Promise<Object> {
        const { id } = req.auth!;
        let user;
        try {
            user = await prisma.user.findFirstOrThrow({
                where: { id },
                include: {
                    anime_list: {
                        include: {
                            anime: true
                        }
                    }
                }
            });
        } catch (error) {
            return res.status(403).json({ message: "unauthorized" })
        }
        return res.json(user.anime_list);
    }

    public static async importList(req: RequestWithAuth, res: Response): Promise<any> {
        // TODO: A lot of not optimized loops and methods, rewrite this method
        // Get current user
        const { id } = req.auth!;
        let user;
        try {
            user = await prisma.user.findFirstOrThrow({
                where: { id },
                include: {
                    integration: true,
                    shikimori_link: true,
                }
            });
        } catch (error) {
            return res.status(403).json({ message: "unauthorized" })
        }
        const shikimoriapi = new ShikimoriApi(user);
        let animeList = await shikimoriapi.getUserList();
        if (!animeList) return res.status(401).json({
            message: 'User does not have shikimori integration'
        });
        if ((<ServerError>animeList).reqStatus === 500) return res.status(500).json({ message: "Server error" });
        console.log("Got list");
        const watchList: ShikimoriWatchList[] = animeList as ShikimoriWatchList[];
        const shikimoriAnimeIds: number[] = watchList.map((anime) => anime.target_id);

        // Get all anime from kodik
        const kodik = new KodikApi();
        let result = await kodik.getBatchAnime(shikimoriAnimeIds);

        const error = result as ServerError;
        if (error.reqStatus === 500) return res.status(500).json({ message: "Server error" });

        result = result as KodikAnimeWithTranslationsFullRequest[];
        if (res.headersSent) return;
        console.log("Got anime from kodik");

        // Isolate all results that returned nothing
        const noResult = result.filter(result => result.result == null);
        const noResultIds = noResult.map(result => result.shikimori_request)
        result = result.filter(result => result.result != null);

        // Request all isolated ids from shikimori
        // Splice all ids into groups of 50, so we can batch request anime from shikimori
        const idsSpliced = groupArrSplice(noResultIds, 50);
        const shikimoriRes: Promise<any>[] = idsSpliced.flatMap(async batch => {
            let response = await shikimoriapi.getBatchAnime(batch);
            if ((<ServerError>response).reqStatus === 500) return res.status(500).json({ message: "Server error" });
            return (<ShikimoriAnime[]>response);
        });
        let noResultAnime: ShikimoriAnime[] = await Promise.all(shikimoriRes.flatMap(async p => await p));
        noResultAnime = noResultAnime.flat();

        if (res.headersSent) return;
        
        const animeUpdateService = new AnimeUpdateService(shikimoriapi, user);
        await animeUpdateService.updateGroups(result);
        let animeInList = await animeUpdateService.updateAnimeKodik(result);
        const shikimoriUpdate = await animeUpdateService.updateAnimeShikimori(noResultAnime);

        animeInList = animeInList.concat(shikimoriUpdate);
        for (let i = 0; i < watchList.length; i++) {
            const listEntry = watchList[i];
            const res = await prisma.anime_list.updateMany({
                where: {
                    AND: {
                        user_id: id,
                        anime_id: animeInList.find((anime) => anime.shikimori_id == listEntry.target_id)!.id,
                    }
                },
                data: {
                    status: listEntry.status,
                    watched_episodes: listEntry.episodes,
                    rating: listEntry.score
                }
            });
            // if were updated, remove from array, to prevent inserting
            // prisma does not have upsert many, so we remove updated titles
            const { count } = res;
            if (count > 0) watchList.splice(i--, 1);
        }
        await prisma.anime_list.createMany({
            data: watchList.map((listEntry) => {
                return {
                    is_favorite: false,
                    status: listEntry.status,
                    watched_episodes: listEntry.episodes,
                    user_id: id,
                    anime_id: animeInList.find((anime) => anime.shikimori_id == listEntry.target_id)!.id,
                    rating: listEntry.score,
                }
            })
        });
        return res.json({
            message: 'List imported successfully'
        });
    }

    public static async addToList(req: RequestWithAuth, res: Response) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() });
        }
        const { is_favorite, rating, status, watched_episodes } = req.body as AddToList;
        const { id } = req.auth!;
        try {
            await prisma.user.findFirstOrThrow({
                where: { id },
            });
        } catch (error) {
            return res.status(403).json({ message: "unauthorized" })
        }
        const animeListEntry = await prisma.anime_list.findFirst({
            where: {
                AND: {
                    user_id: id,
                    anime_id: req.params.anime_id as unknown as number,
                }
            }
        });
        if (animeListEntry) return res.status(400).json({
            error: {
                anime_id: "List entry with this anime already exists",
            }
        });
        await prisma.anime_list.create({
            data: {
                is_favorite,
                status,
                watched_episodes,
                rating,
                anime_id: req.params.anime_id as unknown as number,
                user_id: id
            }
        });
        const anime_list = await prisma.anime_list.findMany({
            where: {
                AND: {
                    user_id: id,
                    anime_id: req.params.anime_id as unknown as number,
                }
            },
            include: {
                anime: true
            }
        })
        return res.json({
            data: anime_list
        });
    }

    public static async editList(req: RequestWithAuth, res: Response) {
        const result = validationResult(req);
        if (!result.isEmpty()) return res.status(422).json({ errors: result.array() });
        const { is_favorite, rating, status, watched_episodes } = req.body as AddToList;
        const { id } = req.auth!;
        try {
            await prisma.user.findFirstOrThrow({
                where: { id },
            });
        } catch (error) {
            return res.status(403).json({ message: "unauthorized" })
        }
        const animeListEntry = await prisma.anime_list.findFirst({
            where: {
                AND: {
                    user_id: id,
                    anime_id: req.params.anime_id as unknown as number,
                }
            }
        });
        if (!animeListEntry) return res.status(400).json({
            error: {
                anime_id: "List entry with this anime doesn't exists",
            }
        });
        await prisma.anime_list.updateMany({
            where: { anime_id: req.params.anime_id as unknown as number },
            data: {
                is_favorite,
                status,
                watched_episodes,
                rating,
            }
        });
        const anime_list = await prisma.anime_list.findMany({
            where: {
                AND: {
                    user_id: id,
                    anime_id: req.params.anime_id as unknown as number,
                }
            },
            include: {
                anime: true
            }
        })
        return res.json({
            data: anime_list
        });
    }

    public static async deleteFromList(req: RequestWithAuth, res: Response) {
        const { id } = req.auth!;
        try {
            await prisma.user.findFirstOrThrow({
                where: { id },
            });
        } catch (error) {
            return res.status(403).json({ message: "unauthorized" })
        }
        const animeListEntry = await prisma.anime_list.findFirst({
            where: {
                AND: {
                    user_id: id,
                    anime_id: req.params.anime_id as unknown as number,
                }
            }
        });
        if (!animeListEntry) return res.status(400).json({
            error: {
                anime_id: "List entry with this anime doesn't exists",
            }
        });
        await prisma.anime_list.deleteMany({
            where: { anime_id: req.params.anime_id as unknown as number },
        });
        return res.json({
            message: "Entry deleted successfully"
        });
    }
}