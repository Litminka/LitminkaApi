import { Response } from "express";
import { validationResult } from "express-validator";
import { DeleteFollow, Follow, RequestWithAuth } from "../ts/index";
import { prisma } from '../db';
// import KodikApi from "../helper/kodikapi";
import { Anime_translation } from "@prisma/client";
import { AnimeStatuses, FollowTypes, RequestStatuses } from "../ts/enums";



export default class FollowController {

    public static async follow(req: RequestWithAuth, res: Response) {
        const { group_name, type } = req.body as Follow;
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });
        const anime_id: number = req.params.anime_id as unknown as number;
        const anime = await prisma.anime.findFirstOrThrow({
            where: { id: anime_id },
            include: {
                anime_translations: {
                    include: {
                        group: true
                    }
                }
            }
        })

        if (type === FollowTypes.Follow) {
            const translation = anime.anime_translations.find(anime => anime.group.name == group_name)
            if (translation === undefined) return res.status(RequestStatuses.UnprocessableContent).json({ error: "This anime doesn't have given group" })
            if (anime.current_episodes >= anime.max_episodes && anime.current_episodes === translation.current_episodes) {
                return res.status(RequestStatuses.UnprocessableContent).json({ message: "Can't follow non ongoing anime" });
            }
            const follow = await prisma.follow.findFirst({
                where: {
                    anime_id,
                    user_id: id,
                    translation: {
                        group: {
                            name: translation.group.name
                        }
                    }
                }
            });
            if (follow) return res.status(RequestStatuses.UnprocessableContent).json({ error: "This anime is already followed as \"follow\"" })
            await prisma.user.update({
                where: { id },
                data: {
                    follows: {
                        create: {
                            status: FollowTypes.Follow,
                            anime_id: anime.id,
                            translation_id: translation.id,
                        }
                    }
                }
            });
        }
        if (type === FollowTypes.Announcement) {
            if (anime.status !== AnimeStatuses.Announced) return res.status(RequestStatuses.UnprocessableContent).json({ message: "Can't follow non announced anime" });
            const follow = await prisma.follow.findFirst({
                where: {
                    anime_id,
                    user_id: id,
                    status: FollowTypes.Announcement
                }
            })
            if (follow) return res.status(RequestStatuses.UnprocessableContent).json({ error: "This anime is already followed as \"announcement\"" });
            await prisma.user.update({
                where: { id },
                data: {
                    follows: {
                        create: {
                            status: FollowTypes.Announcement,
                            anime_id: anime.id,
                        }
                    }
                }
            });
        }
        return res.status(RequestStatuses.OK).json({
            message: "Anime followed successfully"
        })
    }

    public static async unfollow(req: RequestWithAuth, res: Response) {
        const { group_name } = req.body as DeleteFollow;
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });
        const anime_id: number = req.params.anime_id as unknown as number;
        let anime;
        try {
            anime = await prisma.anime.findFirstOrThrow({
                where: { id: anime_id },
                include: {
                    anime_translations: {
                        include: {
                            group: true
                        }
                    }
                }
            })
        } catch (error) {
            return res.status(RequestStatuses.NotFound).json({ message: "This anime doesn't exist" });
        }

        if (!group_name) {
            prisma.follow.deleteMany({
                where: {
                    user_id: user.id,
                    anime_id: anime.id
                }
            })
            return res.status(RequestStatuses.OK).json({ message: "Unfollowed" });
        }
        const translation = anime.anime_translations.find(anime => anime.group.name == group_name);
        if (translation === undefined) return res.status(RequestStatuses.UnprocessableContent).json({ error: "This anime doesn't have given group" })
        await prisma.follow.deleteMany({
            where: {
                user_id: user.id,
                anime_id: anime.id,
                translation_id: translation.id
            }
        })
        return res.status(RequestStatuses.OK).json({ message: "Translation unfollowed" });
    }
}