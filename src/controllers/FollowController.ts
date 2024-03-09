import { Response } from "express";
import { DeleteFollow, Follow, RequestWithAuth } from "../ts/index";
import { RequestStatuses } from "../ts/enums";
import User from "../models/User";
import FollowService from "../services/FollowService";
import ForbiddenError from "../errors/clienterrors/ForbiddenError";

export default class FollowController {

    // FIXME: Refactor to middleware
    public static async follow(req: RequestWithAuth, res: Response) {
        const { group_name, type } = req.body as Follow;
        const { id }: { id: number } = req.auth!;
        const user = await User.findUserById(id);
        if (!user) throw new ForbiddenError("Unauthorized");
        const anime_id: number = req.params.anime_id as unknown as number;

        await FollowService.follow(anime_id, user.id, type, group_name )

        return res.status(RequestStatuses.OK).json({
            message: "Anime followed successfully"
        })
    }

    
    // FIXME: Refactor to middleware
    public static async unfollow(req: RequestWithAuth, res: Response) {
        const { group_name } = req.body as DeleteFollow;
        const { id }: { id: number } = req.auth!;
        const user = await User.findUserById(id);
        if (!user) throw new ForbiddenError("Unauthorized");
        const anime_id: number = req.params.anime_id as unknown as number;

        await FollowService.unfollow(anime_id, user.id, group_name)
        
        return res.status(RequestStatuses.OK).json({ 
            message: "Anime unfollowed successfully" 
        });
    }
}