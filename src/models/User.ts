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

    public static async findUserById(id: number){
        return await prisma.user.findFirst({ where: { id } });
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
}