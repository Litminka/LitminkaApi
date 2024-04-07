import { Response } from "express";
import { AddWithAnime } from "@/ts";
import { RequestStatuses } from "@/ts/enums";
import GroupAnimeListService from "@services/group/GroupAnimeListService";
import { GetGroupAnimeListReq } from "@requests/group/animeList/GetGroupAnimeListRequest";
import { AddGroupAnimeListReq } from "@requests/group/animeList/AddGroupAnimeListRequest";
import { UpdateGroupAnimeListReq } from "@requests/group/animeList/UpdateGroupAnimeListRequest";
import { DeleteGroupAnimeListReq } from "@requests/group/animeList/DeleteGroupAnimeListRequest";

export default class GroupAnimeListController {

    public static async get(req: GetGroupAnimeListReq, res: Response) {
        const user = req.auth.user
        const groupId = req.params.groupId;
        const statuses = req.body.statuses;
        const ratings = req.body.ratings;
        const isFavorite = req.body.isFavorite;
        const query = req.query

        const groupAnimeList = await GroupAnimeListService.get(user.id, groupId, { statuses, ratings, isFavorite }, query)
        const groupAnimeListCount = await GroupAnimeListService.getCount(groupId, { statuses, ratings, isFavorite })

        return res.status(RequestStatuses.OK).json({ count: groupAnimeListCount, body: groupAnimeList });
    }

    public static async add(req: AddGroupAnimeListReq, res: Response) {
        const user = req.auth.user

        const groupId = req.params.groupId;
        const animeId = req.params.animeId;

        const data = req.body as AddWithAnime;
        data.animeId = animeId;

        const result = await GroupAnimeListService.add({ data, groupId, userId: user.id });

        return res.status(RequestStatuses.OK).json(result);
    }

    public static async update(req: UpdateGroupAnimeListReq, res: Response) {
        const user = req.auth.user

        const groupId = req.params.groupId;
        const animeId = req.params.animeId;

        const data = req.body as AddWithAnime;
        data.animeId = animeId;
        await GroupAnimeListService.update({ data, groupId, userId: user.id });

        return res.status(RequestStatuses.OK).json({ message: "updated" });
    }

    public static async delete(req: DeleteGroupAnimeListReq, res: Response) {
        const user = req.auth.user

        const groupId = req.params.groupId;
        const animeId = req.params.animeId;

        await GroupAnimeListService.delete({ animeId, groupId, userId: user.id });

        return res.status(RequestStatuses.OK).json({ message: 'anime_removed_from_list' });
    }


}