import { Response } from "express";
import { validationResult } from "express-validator";
import { DeleteFollow, Follow, FollowAnime, RequestWithAuth } from "../ts/index";
import { prisma } from '../db';
import { AnimeStatuses, FollowTypes, RequestStatuses } from "../ts/enums";
import BaseError from "../errors/BaseError";
import UnprocessableContentError from "../errors/clienterrors/UnprocessableContentError";
import NotFoundError from "../errors/clienterrors/NotFoundError";
import FollowModel from "../models/Follow";
import User from "../models/User";
import FollowService from "../services/FollowService";
import ForbiddenError from "../errors/clienterrors/ForbiddenError";
import AnimeModel from "../models/Anime";
import BadRequestError from "../errors/clienterrors/BadRequestError";

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