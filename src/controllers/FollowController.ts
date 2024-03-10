import { Response } from "express";
import { DeleteFollow, Follow, RequestWithAuth, RequestWithUser } from "../ts/index";
import { RequestStatuses } from "../ts/enums";
import FollowService from "../services/FollowService";
import ForbiddenError from "../errors/clienterrors/ForbiddenError";
import prisma from "../db";

export default class FollowController {

    // FIXME: Refactor to middleware
    public static async follow(req: RequestWithUser, res: Response) {
        const { groupName, type } = req.body as Follow;
        const user = req.auth.user
        const animeId: number = req.params.animeId as unknown as number;

        await FollowService.follow(animeId, user.id, type, groupName)

        return res.status(RequestStatuses.OK).json({
            message: "Anime followed successfully"
        })
    }


    // FIXME: Refactor to middleware
    public static async unfollow(req: RequestWithAuth, res: Response) {
        const { groupName } = req.body as DeleteFollow;
        const { id }: { id: number } = req.auth!;
        const user = await prisma.user.findUserById(id);
        if (!user) throw new ForbiddenError("Unauthorized");
        const animeId: number = req.params.animeId as unknown as number;

        await FollowService.unfollow(animeId, user.id, groupName)

        return res.status(RequestStatuses.OK).json({
            message: "Anime unfollowed successfully"
        });
    }
}