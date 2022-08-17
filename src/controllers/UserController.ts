import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { prisma } from '../db';
import { Encrypt } from "../helper/encrypt";
import * as jwt from "jsonwebtoken";
import { RequestWithAuth } from "../ts/custom";

export default class UserController {
    static async createUser(req: Request, res: Response): Promise<Object> {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() });
        }
        const { email, login, password, name }: { email: string, login: string, password: string, name: string | null } = req.body
        await prisma.user.create({
            data: {
                email,
                login,
                password: await Encrypt.cryptPassword(password),
                name,
                role: {
                    connectOrCreate: {
                        where: {
                            name: "user"
                        },
                        create: {
                            name: "user"
                        }
                    }
                }
            }
        });
        return res.json({
            data: {
                message: "User created successfuly"
            }
        });
    }

    static async loginUser(req: Request, res: Response): Promise<Object> {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(422).json({ errors: result.array() });
        }
        const { login, password }: { login: string, password: string } = req.body;
        const user = await prisma.user.findFirst({
            select: {
                id: true,
                password: true,
            },
            where: {
                OR: [
                    { login: { equals: login } },
                    { email: { equals: login } }
                ]
            }
        });
        if (!user) return res.status(401).json({
            data: {
                error: "Login or password incorrect",
            }
        });
        if (!await Encrypt.comparePassword(password, user.password)) return res.status(401).json({
            data: {
                error: "Login or password incorrect",
            }
        });
        const { id } = user;
        console.log(id);
        const token = jwt.sign({ id }, process.env.tokenSecret!, { expiresIn: process.env.tokenLife })
        const refreshToken = jwt.sign({ id }, process.env.tokenRefreshSecret!, { expiresIn: process.env.tokenRefreshLife })
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                user_id: id
            }
        });
        return res.status(200).json({
            data: {
                message: "You've successfuly logged in",
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

        // FIXME: Remove sensitive data from this

        if (!user) return res.status(403).json({
            data: {
                message: "Unauthorized",
            }
        })
        return res.status(200).json({
            data: {
                message: `Welcome! ${user.login}`,
                user
            }
        });
    }
}
