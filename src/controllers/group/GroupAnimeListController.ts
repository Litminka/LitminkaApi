import { Response } from "express";
import { AddWithAnime, RequestWithAuth } from "../../ts";
import { RequestStatuses } from "../../ts/enums";
import { prisma } from "../../db";
import GroupAnimeListService from "../../services/group/GroupAnimeListService";

export default class GroupAnimeListController {

    public static async get(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { ownedGroups: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const groupId = req.params.groupId as unknown as number;

        const result = await GroupAnimeListService.get(id, groupId);

        return res.status(RequestStatuses.OK).json(result);
    }

    public static async add(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { ownedGroups: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const groupId = req.params.groupId as unknown as number;
        const animeId = req.params.animeId as unknown as number;

        const data = req.body as AddWithAnime;
        data.animeId = animeId;

        const result = await GroupAnimeListService.add({ data, groupId, userId: id });

        return res.status(RequestStatuses.OK).json(result);
    }

    public static async update(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { ownedGroups: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const groupId = req.params.groupId as unknown as number;
        const animeId = req.params.animeId as unknown as number;

        const data = req.body as AddWithAnime;
        data.animeId = animeId;
        await GroupAnimeListService.update({ data, groupId, userId: id });

        return res.status(RequestStatuses.OK).json({ message: "updated" });
    }

    public static async delete(req: RequestWithAuth, res: Response) {
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findFirst({ where: { id }, include: { ownedGroups: true } });
        if (!user) return res.status(RequestStatuses.Forbidden).json({ errors: "unauthorized" });

        const groupId = req.params.groupId as unknown as number;
        const animeId = req.params.animeId as unknown as number;

        await GroupAnimeListService.delete({ animeId, groupId, userId: id });

        return res.status(RequestStatuses.OK).json({ message: 'anime_removed_from_list' });
    }


}