import { Response } from "express";
import { DeleteFollow, Follow, RequestWithAuth, RequestWithUser } from "../ts/index";
import { RequestStatuses } from "../ts/enums";
import FollowService from "../services/FollowService";
import ForbiddenError from "../errors/clienterrors/ForbiddenError";
import prisma from "../db";

export default class FollowController {

    public static async follow(req: RequestWithUser, res: Response) {

        const user = req.auth.user;
        const animeId: number = req.params.animeId as unknown as number;
        const { groupName, type } = req.body as Follow;

        await FollowService.follow(animeId, user.id, type, groupName)

        return res.status(RequestStatuses.OK).json({
            message: "Anime followed successfully"
        })
    }


    // FIXME: Refactor to middleware
    public static async unfollow(req: RequestWithUser, res: Response) {

        const user = req.auth.user;
        const { groupName } = req.body as DeleteFollow;
        const animeId: number = req.params.animeId as unknown as number;
        
        await FollowService.unfollow(animeId, user.id, groupName)

        return res.status(RequestStatuses.OK).json({
            message: "Anime unfollowed successfully"
        });
    }
}