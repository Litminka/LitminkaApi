import { Response } from 'express';
import { RequestStatuses } from '@enums';
import UserService from '@services/UserService';
import LoginUserRequest from '@requests/user/LoginUserRequest';
import RegisterUserRequest from '@requests/user/RegisterUserRequest';
import UpdateSettingsRequest from '@requests/user/UpdateSettingsRequest';
import ProfileUserRequest from '../requests/ProfileUserRequest';

export default class UserController {
    static async create(req: RegisterUserRequest, res: Response) {
        const { email, login, password, name } = req.body;
        UserService.create({ email, login, password, name });

        return res.status(RequestStatuses.Created).json();
    }

    static async login(req: LoginUserRequest, res: Response) {
        const { login, password } = req.body;

        const { token, refreshToken } = await UserService.login({
            login,
            password
        });

        return res.status(RequestStatuses.OK).json({
            body: {
                token,
                refreshToken
            }
        });
    }

    static async getProfile(req: ProfileUserRequest, res: Response) {
        const user = req.user;

        return res.status(RequestStatuses.OK).json({ body: user });
    }

    static async updateSettings(req: UpdateSettingsRequest, res: Response) {
        const user = req.user;
        const data = req.body;

        const settings = await UserService.updateSettings(user, data);

        return res.status(RequestStatuses.Accepted).json({ body: settings });
    }
}
