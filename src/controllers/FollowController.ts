import { Response } from "express";
import { RequestStatuses } from "@/ts/enums";
import FollowService from "@services/FollowService";
import { FollowAnimeReq } from "@/requests/anime/FollowAnimeRequest";
import { UnFollowAnimeReq } from "@/requests/anime/UnfollowAnimeRequest";

export default class FollowController {

    public static async follow(req: FollowAnimeReq, res: Response) {
        const user = req.auth.user;
        const animeId = req.params.animeId;
        const { groupName, type } = req.body

        await FollowService.follow(animeId, user.id, type, groupName)

        return res.status(RequestStatuses.OK).json({
            message: "Anime followed successfully"
        })
    }

    public static async unfollow(req: UnFollowAnimeReq, res: Response) {

        const user = req.auth.user;
        const { groupName } = req.body;
        const animeId = req.params.animeId;

        await FollowService.unfollow(animeId, user.id, groupName)

        return res.status(RequestStatuses.OK).json({
            message: "Anime unfollowed successfully"
        });
    }
}