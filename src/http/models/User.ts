import { CreateUser } from '@/ts/user';
import { FollowAnime } from '@/ts/follow';
import prisma from '@/db';
import { Prisma } from '@prisma/client';

const extention = Prisma.defineExtension({
    name: 'UserModel',
    model: {
        user: {
            async createUser(createUser: CreateUser) {
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
                                    name: 'user'
                                },
                                create: {
                                    name: 'user'
                                }
                            }
                        },
                        integration: { create: {} },
                        settings: { create: {} }
                    }
                });
            },
            /**
             * Find first user with ID or throw exception.
             * Accepts additional dynamic selects.
             * @param id User ID
             * @param query Prisma.UserSelect type
             * @returns User object
             */
            async findUserById<T extends Prisma.UserSelect>(id: number, query: T) {
                const _query = {
                    ...query,
                    id: true,
                    name: true,
                    email: true,
                    login: true,
                    createdAt: true,
                    roleId: true,
                    role: { include: { permissions: true } }
                } satisfies Prisma.UserSelect;

                return (await prisma.user.findFirstOrThrow({
                    where: { id },
                    select: _query
                })) as Promise<Prisma.UserGetPayload<{ select: typeof _query }>>;
            },
            async findUserByShikimoriLinkToken(token: string) {
                return await prisma.user.findFirstOrThrow({
                    where: {
                        shikimoriLink: {
                            token
                        }
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        login: true,
                        createdAt: true,
                        roleId: true,
                        integration: true,
                        shikimoriLink: true
                    }
                });
            },
            /** Prefer using `findUserById()` with query parameter
             * @deprecated
             * @param id
             * @returns
             */
            async findUserByIdWithIntegration(id: number) {
                return await prisma.user.findFirstOrThrow({
                    where: {
                        id
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        login: true,
                        createdAt: true,
                        roleId: true,
                        integration: true,
                        shikimoriLink: true
                    }
                });
            },
            /**
             * # WIP method
             * @param id
             * @returns
             */
            async disableUserById(id: number) {
                return await prisma.user.update({
                    where: { id },
                    data: {}
                });
            },
            async deleteUserById(id: number) {
                return await prisma.user.delete({
                    where: { id }
                });
            },
            /**
             * @deprecated
             * @param login
             * @returns
             */
            async findUserByLogin(login: string) {
                return prisma.user.findFirst({
                    where: {
                        OR: [{ login: { equals: login } }, { email: { equals: login } }]
                    },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        login: true,
                        createdAt: true,
                        roleId: true,
                        password: true,
                        role: { include: { permissions: true } }
                    }
                });
            },
            async followAnime(follow: FollowAnime) {
                const { animeId, userId, status, translationId } = follow;
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
            },
            async removeIntegrationById(id: number) {
                await prisma.user.update({
                    where: { id },
                    data: {
                        integration: {
                            update: {
                                shikimoriCode: null,
                                shikimoriId: null,
                                shikimoriRefreshToken: null,
                                shikimoriToken: null
                            }
                        }
                    }
                });
            },
            async disableShikimoriListUpdate(id: number) {
                await prisma.user.update({
                    where: {
                        id
                    },
                    data: {
                        integration: {
                            update: {
                                shikimoriCanChangeList: false
                            }
                        }
                    }
                });
            }
        }
    }
});

export { extention as UserExt };
