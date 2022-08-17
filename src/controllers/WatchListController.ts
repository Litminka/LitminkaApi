import ShikimoriApi from "../helper/shikimoriapi";
import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { prisma } from '../db';
import { AddToList, KodikAnimeFullRequest, RequestWithAuth, ServerError, ShikimoriAnime, ShikimoriWatchList, ShikimoriWhoAmI } from "../ts/custom";
import groupArrSplice from "../helper/groupsplice";
import KodikApi from "../helper/kodikapi";
import { create } from "domain";
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
        const watchList: ShikimoriWatchList[] = (<ShikimoriWatchList[]>animeList);
        const shikimoriAnimeIds: number[] = watchList.map((anime) => anime.target_id);
        // Splice all ids into groups of 50, so we can batch request anime from shikimori
        //TODO: Rewrite this entirely to use kodik's api
        const kodik = new KodikApi();
        const awaitResult: Promise<any>[] = shikimoriAnimeIds.flatMap(async shikimori_id => {
            let response = await kodik.getFullAnime(shikimori_id);
            if ((<ServerError>response).reqStatus === 500) return res.status(500).json({ message: "Server error" });
            return (<KodikAnimeFullRequest>response);
        });
        let result: KodikAnimeFullRequest[] = await Promise.all(awaitResult.flatMap(async p => await p));
        console.log("Got anime from kodik");
        if (res.headersSent) return;
        // FIXME: Skip adding to list if not on kodik
        // FIXME: result is empty, maybe pass something?
        const genres = result.flatMap(kodikresult => {
            return kodikresult.results.map(result => result.translation);
        });
        const genresUnique: any[] = [];
        genres.filter(function (item) {
            var i = genresUnique.findIndex(x => (x.id == item.id));
            if (i <= -1) genresUnique.push(item);
            return null;
        });
        await prisma.$transaction(
            genresUnique.map(genre => {
                return prisma.group.upsert({
                    where: { id: genre.id },
                    create: {
                        id: genre.id,
                        name: genre.title,
                        type: genre.type
                    },
                    update: {}
                });
            }));

        const animeInList = await prisma.$transaction(
            result.map((record) => {
                console.log(record);
                const { results } = record;
                const [anime] = results;
                const { material_data } = anime;
                return prisma.anime.upsert({
                    where: {
                        shikimori_id: parseInt(anime.shikimori_id),
                    },
                    create: {
                        current_episodes: material_data.episodes_aired,
                        max_episodes: material_data.episodes_total,
                        shikimori_id: parseInt(anime.shikimori_id),
                        english_name: material_data.title_en,
                        status: material_data.anime_status,
                        image: material_data.poster_url,
                        name: material_data.anime_title,
                        media_type: material_data.anime_kind,
                        shikimori_score: material_data.shikimori_rating,
                        first_episode_aired: new Date(material_data.aired_at),
                        kodik_link: anime.link,
                        rpa_rating: material_data.rating_mpaa,
                        description: material_data.anime_description,
                        last_episode_aired: material_data.released_at ? new Date(material_data.released_at) : null,
                        anime_translations: {
                            createMany: {
                                data: results.map(anime => {
                                    return {
                                        group_id: anime.translation.id,
                                        current_episodes: anime.episodes_count ?? 0
                                    }
                                })
                            }
                        },
                        genres: {
                            connectOrCreate: material_data.anime_genres.map(genre => {
                                return {
                                    where: {
                                        name: genre
                                    },
                                    create: {
                                        name: genre
                                    }
                                }
                            })
                        }
                    },
                    update: {
                        current_episodes: material_data.episodes_aired,
                        max_episodes: material_data.episodes_total,
                        status: material_data.anime_status,
                        image: material_data.poster_url,
                        shikimori_score: material_data.shikimori_rating,
                        first_episode_aired: new Date(material_data.aired_at),
                        last_episode_aired: material_data.released_at ? new Date(material_data.released_at) : null
                    }
                });
            })
        );
        console.log("anime updated");
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
            // if were updated, remove from watchlist
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
        console.log("watchlist imported");
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
        let user;
        try {
            user = await prisma.user.findFirstOrThrow({
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
        let user;
        try {
            user = await prisma.user.findFirstOrThrow({
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
        let user;
        try {
            user = await prisma.user.findFirstOrThrow({
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
            message: "Entry deleted successfuly"
        });
    }
}