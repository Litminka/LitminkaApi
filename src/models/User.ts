import { CreateUser, LoginUser } from "../ts";
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
}