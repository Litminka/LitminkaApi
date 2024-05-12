import { Response } from 'express';
import { RequestStatuses } from '@enums';
import FollowService from '@services/FollowService';
import FollowAnimeRequest from '@requests/anime/FollowAnimeRequest';
import UnFollowAnimeRequest from '@requests/anime/UnfollowAnimeRequest';

export default class FollowController {
    public static async follow(req: FollowAnimeRequest, res: Response) {
        const user = req.user;
        const animeId = req.params.animeId;
        const { groupName, type } = req.body;

        await FollowService.follow(animeId, user.id, type, groupName);

        return res.status(RequestStatuses.Created).json();
    }

    public static async unfollow(req: UnFollowAnimeRequest, res: Response) {
        const user = req.user;
        const { groupName } = req.body;
        const animeId = req.params.animeId;

        await FollowService.unfollow(animeId, user.id, groupName);

        return res.status(RequestStatuses.Accepted).json();
    }
}
