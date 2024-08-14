import { Response } from 'express';
import { AddWithAnime } from '@/ts/watchList';
import { RequestStatuses } from '@enums';
import GroupAnimeListService from '@services/group/GroupAnimeListService';
import GetGroupAnimeListRequest from '@requests/group/animeList/GetGroupAnimeListRequest';
import AddGroupAnimeListRequest from '@requests/group/animeList/AddGroupAnimeListRequest';
import UpdateGroupAnimeListRequest from '@requests/group/animeList/UpdateGroupAnimeListRequest';
import DeleteGroupAnimeListRequest from '@requests/group/animeList/DeleteGroupAnimeListRequest';

export default class GroupAnimeListController {
    public static async get(req: GetGroupAnimeListRequest, res: Response) {
        const user = req.user;
        const groupId = req.params.groupId;
        const statuses = req.query.statuses;
        const ratings = req.query.ratings;
        const isFavorite = req.query.isFavorite;
        const query = req.query;

        const groupAnimeList = await GroupAnimeListService.get(
            user.id,
            groupId,
            { statuses, ratings, isFavorite },
            query
        );
        const groupAnimeListCount = await GroupAnimeListService.getCount(groupId, {
            statuses,
            ratings,
            isFavorite
        });

        return res
            .status(RequestStatuses.OK)
            .json({ count: groupAnimeListCount, body: groupAnimeList });
    }

    public static async add(req: AddGroupAnimeListRequest, res: Response) {
        const user = req.user;

        const groupId = req.params.groupId;
        const animeId = req.params.animeId;

        const data = req.body as AddWithAnime;
        data.animeId = animeId;

        const result = await GroupAnimeListService.add({
            data,
            groupId,
            userId: user.id
        });

        return res.status(RequestStatuses.Created).json({ body: result });
    }

    public static async update(req: UpdateGroupAnimeListRequest, res: Response) {
        const user = req.user;

        const groupId = req.params.groupId;
        const animeId = req.params.animeId;

        const data = req.body as AddWithAnime;
        data.animeId = animeId;
        await GroupAnimeListService.update({ data, groupId, userId: user.id });

        return res.status(RequestStatuses.Accepted).json();
    }

    public static async delete(req: DeleteGroupAnimeListRequest, res: Response) {
        const user = req.user;

        const groupId = req.params.groupId;
        const animeId = req.params.animeId;

        await GroupAnimeListService.delete({
            animeId,
            groupId,
            userId: user.id
        });

        return res.status(RequestStatuses.Accepted).json();
    }
}
