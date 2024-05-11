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
            async findUserByIdWithAnimeList(id: number) {
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
            },
            async findUserByShikimoriLinkToken(token: string) {
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
            },
            async findWithIntegrationSettings(id: number) {
                return prisma.user.findFirstOrThrow({
                    where: { id },
                    include: {
                        settings: true,
                        integration: true
                    }
                });
            },
            async findWithSettings(id: number) {
                return prisma.user.findFirstOrThrow({
                    where: { id },
                    include: {
                        settings: true
                    }
                });
            },
            async findUserByIdWithIntegration(id: number) {
                return await prisma.user.findFirstOrThrow({
                    where: {
                        id
                    },
                    include: {
                        integration: true,
                        shikimoriLink: true
                    }
                });
            },
            async findUserByIdWithRolePermission(id: number) {
                return await prisma.user.findFirstOrThrow({
                    where: {
                        id
                    },
                    include: {
                        role: {
                            include: {
                                permissions: true
                            }
                        }
                    }
                });
            },
            async findUserWithTokensAndPermissions(id: number) {
                return await prisma.user.findFirstOrThrow({
                    where: { id },
                    include: {
                        role: {
                            include: { permissions: true }
                        },
                        sessionTokens: true
                    }
                });
            },
            async findUserById(id: number) {
                return await prisma.user.findFirstOrThrow({
                    where: { id }
                });
            },
            async findUserWithOwnedGroups(id: number) {
                return await prisma.user.findFirstOrThrow({
                    where: { id },
                    include: { ownedGroups: true }
                });
            },
            async findUserWithGroupInvites(id: number) {
                return await prisma.user.findFirstOrThrow({
                    where: { id },
                    include: { groupInvites: true }
                });
            },
            async removeById(id: number) {
                return await prisma.user.delete({
                    where: {
                        id
                    }
                });
            },
            async findUserByLogin(login: string) {
                return prisma.user.findFirst({
                    include: {
                        role: {
                            include: {
                                permissions: true
                            }
                        }
                    },
                    where: {
                        OR: [{ login: { equals: login } }, { email: { equals: login } }]
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
