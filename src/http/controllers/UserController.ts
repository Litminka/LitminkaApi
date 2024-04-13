import { Response } from 'express';
import { RequestStatuses } from '@enums';
import UserService from '@services/UserService';
import { WithPermissionsReq } from '@requests/WithPermissionsRequest';
import { LoginUserReq } from '@requests/user/LoginUserRequest';
import { RegisterUserReq } from '@requests/user/RegisterUserRequest';
import { UpdateSettingsReq } from '@requests/user/UpdateSettingsRequest';

export default class UserController {
    static async create(req: RegisterUserReq, res: Response) {
        const { email, login, password, name } = req.body;
        UserService.create({ email, login, password, name });

        return res.status(RequestStatuses.Created);
    }

    static async login(req: LoginUserReq, res: Response) {
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

    static async profile(req: WithPermissionsReq, res: Response) {
        const user = req.auth.user;

        return res.status(RequestStatuses.OK).json({
            body: {
                user
            }
        });
    }

    static async updateSettings(req: UpdateSettingsReq, res: Response) {
        const user = req.auth.user;
        const data = req.body;

        const settings = await UserService.updateSettings(user, data);

        return res.status(RequestStatuses.Accepted).json({
            body: settings
        });
    }
}
