import { Response } from "express";
import GroupListService from "../../services/group/GroupListService";
import { AddWithAnime, RequestWithAuth } from "../../ts";
import { RequestStatuses } from "../../ts/enums";
import { prisma } from "../../db";
import GroupAnimeListService from "../../services/group/GroupAnimeListService";

export default class GroupAnimeListController {

    public static async get(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { owned_groups: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const group_id = req.params.group_id as unknown as number;

        const result = await GroupAnimeListService.get(id, group_id);

        return res.status(RequestStatuses.OK).json(result);
    }

    public static async add(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { owned_groups: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const group_id = req.params.group_id as unknown as number;
        const anime_id = req.params.anime_id as unknown as number;

        const data = req.body as AddWithAnime;
        data.anime_id = anime_id;

        const result = await GroupAnimeListService.add({ data, group_id, user_id: id });

        return res.status(RequestStatuses.OK).json(result);
    }

    public static async update(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { owned_groups: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const group_id = req.params.group_id as unknown as number;
        const anime_id = req.params.anime_id as unknown as number;

        const data = req.body as AddWithAnime;
        data.anime_id = anime_id;
        await GroupAnimeListService.update({ data, group_id, user_id: id });

        return res.status(RequestStatuses.OK).json({ message: "updated" });
    }

    public static async delete(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { owned_groups: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const group_id = req.params.group_id as unknown as number;
        const anime_id = req.params.anime_id as unknown as number;

        await GroupAnimeListService.delete({ anime_id, group_id, user_id: id });

        return res.status(RequestStatuses.OK).json({ message: 'anime_removed_from_list' });
    }


}