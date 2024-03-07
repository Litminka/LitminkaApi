import { Request, Response } from "express";
import { prisma } from '../db';
import { CreateUser, LoginUser, RequestWithAuth } from "../ts/index";
import { RequestStatuses } from "../ts/enums";
import UserService from "../services/UserService";
import ForbiddenError from "../errors/ForbiddenError";

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
        
        const {token, refreshToken} = await UserService.login({login, password});

        return res.status(RequestStatuses.OK).json({
            data: {
                message: "You've successfully logged in",
                token,
                refreshToken
            }
        });
    }
    // FIXME: Remove this debug method
    static async getUsers(req: Request, res: Response): Promise<Object> {
        const users = await prisma.user.findMany({
            select: {
                login: true,
                name: true,
                role: {
                    select: {
                        name: true,
                        permissions: {
                            select: {
                                name: true,
                            }
                        }
                    }
                }
            }
        });
        return res.json({
            users
        });
    }

    static async profile(req: RequestWithAuth, res: Response): Promise<Object> {
        // FIXME: Refactor to middleware
        const { id } = req.auth!;
        const user = await prisma.user.findFirst({
            where: {
                id
            },
            include: {
                role: {
                    include: {
                        permissions: true
                    }
                }
            },
        });
        if (!user) throw new ForbiddenError('Unauthorized');
        // END

        return res.status(RequestStatuses.OK).json({
            data: {
                message: `Welcome! ${user.login}`,
                user
            }
        });
    }
}
