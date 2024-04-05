import { Response } from "express";
import { RequestStatuses } from "@/ts/enums";
import UserService from "@services/UserService";
import ForbiddenError from "@errors/clienterrors/ForbiddenError";
import { WithPermissionsReq } from "@requests/WithPermissionsRequest";
import { LoginUserReq } from "@requests/user/LoginUserRequest";
import { RegisterUserReq } from "@requests/user/RegisterUserRequest";

export default class UserController {
    static async createUser(req: RegisterUserReq, res: Response): Promise<Object> {
        const { email, login, password, name } = req.body;
        UserService.create({ email, login, password, name })
        return res.json({
            data: {
                message: "User created successfully"
            }
        });
    }

    static async loginUser(req: LoginUserReq, res: Response): Promise<Object> {
        const { login, password } = req.body;

        const { token, refreshToken } = await UserService.login({ login, password });

        return res.status(RequestStatuses.OK).json({
            data: {
                message: "You've successfully logged in",
                token,
                refreshToken
            }
        });
    }

    static async profile(req: WithPermissionsReq, res: Response): Promise<Object> {
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
