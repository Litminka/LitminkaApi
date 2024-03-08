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
                anime_list: {
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
                shikimori_link: {
                    token
                }
            },
            include: {
                integration: true,
                shikimori_link: true
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
                shikimori_link: true
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
        const {anime_id, user_id, status, translation_id} = follow
        await prisma.user.update({
            where: { id: user_id },
            data: {
                follows: {
                    create: {
                        status,
                        anime_id,
                        translation_id
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
                        shikimori_code: null,
                        shikimori_id: null,
                        shikimori_refresh_token: null,
                        shikimori_token: null,
                    }
                }
            }
        })
    }
}