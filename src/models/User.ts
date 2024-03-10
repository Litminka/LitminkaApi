import { CreateUser, FollowAnime, LoginUser, UserNotify } from "../ts";
import { prisma } from "../db";

export default class User {
    public static async createUser(createUser: CreateUser) {
        const { email, login, password, name } = createUser;
        await prisma.user.create({
            data: {
                email,
                login,
                password,
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
                },
                integration: { create: {} }
            }
        });
    }

    public static async getUserByIdAnimeList(id: number){
        return await prisma.user.findFirstOrThrow({
            where: { id },
            include: {
                animeList: {
                    include: {
                        anime: true
                    }
                }
            }
        });
    }

    public static async findUserByShikimoriLinkToken(token: string){
        return await prisma.user.findFirstOrThrow({
            where: {
                shikimoriLink: {
                    token
                }
            },
            include: {
                integration: true,
                shikimoriLink: true
            }
        });
    }

    public static async findUserByIdWithIntegration(id: number){
        return await prisma.user.findFirstOrThrow({
            where: {
                id
            },
            include: {
                integration: true,
                shikimoriLink: true
            },
        });
    }

    public static async findUserByIdWithRolePermission(id: number){
        return await prisma.user.findFirst({
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
    }

    public static async findUserById(id: number){
        return await prisma.user.findFirstOrThrow({ where: { id } });
    }

    public static async findUserByLogin(login: string) {
        return prisma.user.findFirst({
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
    }

    public static async followAnime(follow: FollowAnime){
        const {animeId, userId, status, translationId} = follow
        await prisma.user.update({
            where: { id: userId },
            data: {
                follows: {
                    create: {
                        status,
                        animeId,
                        translationId
                    }
                }
            }
        });
    }

    public static async removeIntegrationById(id: number){
        await prisma.user.update({
            where: { id },
            data: {
                integration: {
                    update: {
                        shikimoriCode: null,
                        shikimoriId: null,
                        shikimoriRefreshToken: null,
                        shikimoriToken: null,
                    }
                }
            }
        })
    }
}