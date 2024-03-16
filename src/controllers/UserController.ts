import { Request, Response } from "express";
import { CreateUser, LoginUser, RequestWithAuth, RequestWithUserPermissions } from "@/ts/index";
import { RequestStatuses } from "@/ts/enums";
import UserService from "@services/UserService";
import ForbiddenError from "@errors/clienterrors/ForbiddenError";

export default class UserController {
    static async createUser(req: Request, res: Response): Promise<Object> {
        const { email, login, password, name }: CreateUser = req.body;
        UserService.create({
            email, login, password, name
        })
        return res.json({
            data: {
                message: "User created successfully"
            }
        });
    }

    static async loginUser(req: Request, res: Response): Promise<Object> {
        const { login, password }: LoginUser = req.body;

        const { token, refreshToken } = await UserService.login({ login, password });

        return res.status(RequestStatuses.OK).json({
            data: {
                message: "You've successfully logged in",
                token,
                refreshToken
            }
        });
    }

    static async profile(req: RequestWithUserPermissions, res: Response): Promise<Object> {
        // FIXME: Refactor to middleware
        const user = req.auth.user;
        if (!user) throw new ForbiddenError('Unauthorized');

        return res.status(RequestStatuses.OK).json({
            data: {
                message: `Welcome! ${user.login}`,
                user
            }
        });
    }
}
