import { Response } from "express";
import { validationResult } from "express-validator";
import { Follow, RequestWithAuth } from "../ts/custom";
import { prisma } from '../db';
// import KodikApi from "../helper/kodikapi";
import { Anime_translation } from "@prisma/client";

export default class FollowController {
    public static async follow(req: RequestWithAuth, res: Response) {
        const result = validationResult(req);
        if (!result.isEmpty()) return res.status(422).json({ errors: result.array() });
        const { group_name } = req.body as Follow;
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, });
        if (!user) return res.status(403).json({ errors: "unathorized" });

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
            return res.status(404).json({ message: "This anime doesn't exist" });
        }
        const translations = anime!.anime_translations.filter(anime => anime.group.name == group_name)
        if (translations.length == 0) return res.status(422).json({ error: "This anime doesn't have given group" })
        const [translation] = translations;
        await prisma.user.update({
            where: { id },
            data: {
                follows: {
                    create: {
                        status: "Follow",
                        anime_id: anime.id,
                        translation_id: translation.id,
                    }
                }
            }
        });
        return res.status(200).json({
            message: "Anime followed successfuly"
        })
    }
}