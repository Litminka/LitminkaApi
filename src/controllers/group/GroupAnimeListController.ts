import { Response } from "express";
import { AddWithAnime, ListFilters, RequestWithUserOwnedGroups, watchListStatus } from "../../ts";
import { RequestStatuses } from "../../ts/enums";
import GroupAnimeListService from "../../services/group/GroupAnimeListService";

export default class GroupAnimeListController {

    public static async get(req: RequestWithUserOwnedGroups, res: Response) {
        const user = req.auth.user
        const groupId = req.params.groupId as unknown as number;
        const statuses: watchListStatus[] = req.body.statuses as watchListStatus[];
        const ratings: number[] = req.body.ratings as number[];
        const isFavorite: boolean = req.body.isFavorite as boolean;

        const filteredGroupAnimeList = await GroupAnimeListService.get(user.id, groupId, {statuses, ratings, isFavorite} as ListFilters)

        //const result = await GroupAnimeListService.get(user.id, groupId);

        return res.status(RequestStatuses.OK).json(filteredGroupAnimeList);
    }

    public static async add(req: RequestWithUserOwnedGroups, res: Response) {
        const user = req.auth.user

        const groupId = req.params.groupId as unknown as number;
        const animeId = req.params.animeId as unknown as number;

        const data = req.body as AddWithAnime;
        data.animeId = animeId;

        const result = await GroupAnimeListService.add({ data, groupId, userId: user.id });

        return res.status(RequestStatuses.OK).json(result);
    }

    public static async update(req: RequestWithUserOwnedGroups, res: Response) {
        const user = req.auth.user

        const groupId = req.params.groupId as unknown as number;
        const animeId = req.params.animeId as unknown as number;

        const data = req.body as AddWithAnime;
        data.animeId = animeId;
        await GroupAnimeListService.update({ data, groupId, userId: user.id });

        return res.status(RequestStatuses.OK).json({ message: "updated" });
    }

    public static async delete(req: RequestWithUserOwnedGroups, res: Response) {
        const user = req.auth.user

        const groupId = req.params.groupId as unknown as number;
        const animeId = req.params.animeId as unknown as number;

        await GroupAnimeListService.delete({ animeId, groupId, userId: user.id });

        return res.status(RequestStatuses.OK).json({ message: 'anime_removed_from_list' });
    }


}