import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import dotenv from 'dotenv';
dotenv.config();
import { Encrypt } from '@/helper/encrypt';
import capitalize from '@/helper/capitalize';
import KodikApiService from '@services/KodikApiService';
import { KodikGenresRequest } from '@/ts/kodik';
import { config } from '@/config';
import AnimeUpdateService from '@services/anime/AnimeUpdateService';
import AutoCheckService from '@services/AutoCheckService';

async function main() {
    const adminRole = await prisma.role.upsert({
        where: { name: 'admin' },
        update: {},
        create: {
            name: 'admin',
            permissions: {
                connectOrCreate: [
                    {
                        where: { name: 'manage_anime' },
                        create: {
                            name: 'manage_anime'
                        }
                    },
                    {
                        where: { name: 'view_lists' },
                        create: {
                            name: 'view_lists'
                        }
                    },
                    {
                        where: { name: 'sync_shikimori' },
                        create: {
                            name: 'sync_shikimori'
                        }
                    }
                ]
            }
        }
    });
    const botRole = await prisma.role.upsert({
        where: { name: 'bot' },
        update: {},
        create: {
            name: 'bot',
            permissions: {
                connectOrCreate: [
                    {
                        where: { name: 'api_service_bot' },
                        create: { name: 'api_service_bot' }
                    }
                ]
            }
        }
    });
    const userRole = await prisma.role.upsert({
        where: { name: 'user' },
        update: {},
        create: {
            name: 'user'
        }
    });
    const admin = await prisma.user.upsert({
        where: { email: 'admin@admin.ru' },
        update: {},
        create: {
            email: 'admin@admin.ru',
            login: process.env.ROOT_LOGIN!,
            password: await Encrypt.cryptPassword(process.env.ROOT_PASS!),
            name: 'Admin',
            role: {
                connect: {
                    id: adminRole.id
                }
            },
            settings: {},
            integration: {}
        }
    });
    const botUser = await prisma.user.upsert({
        where: { email: 'bot@bot.ru' },
        update: {},
        create: {
            email: 'bot@bot.ru',
            login: 'bot',
            password: await Encrypt.cryptPassword('bot'),
            name: 'Bot',
            role: {
                connect: {
                    id: botRole.id
                }
            },
            settings: {},
            integration: {}
        }
    });
    const user = await prisma.user.upsert({
        where: { email: 'user@user.ru' },
        update: {},
        create: {
            email: 'user@user.ru',
            login: 'User',
            password: await Encrypt.cryptPassword('password'),
            name: 'user',
            role: {
                connect: {
                    id: userRole.id
                }
            },
            settings: {},
            integration: {}
        }
    });

    console.dir(admin);
    console.dir(user);
    console.dir(botUser);

    const kodik = new KodikApiService();
    const genres = await kodik.getGenres();
    // Test new logger
    const { results } = genres as KodikGenresRequest;
    results.forEach(async (genre) => {
        await prisma.genre.upsert({
            where: {
                name: capitalize(genre.title)
            },
            create: {
                name: capitalize(genre.title)
            },
            update: {}
        });
    });
    const updateService = new AnimeUpdateService();
    const autoCheckService = new AutoCheckService();
    await autoCheckService.updateGroups();
    await updateService.seedAnime();

    // Create test data
    if (config.createTestData) {
        const animes = await prisma.anime.findMany({
            select: { id: true }
        });

        const animesId = animes.flatMap((anime) => anime.id);

        const random = (mn: number, mx: number) => {
            return Math.random() * (mx - mn) + mn;
        };

        for (const i of Array(20).keys()) {
            const user = await prisma.user.upsert({
                where: { email: `test${i}@test.ru` },
                update: {},
                create: {
                    email: `test${i}@test.ru`,
                    login: `test${i}`,
                    password: await Encrypt.cryptPassword('test'),
                    name: `test${i}`,
                    role: {
                        connect: {
                            id: userRole.id
                        }
                    },
                    settings: {},
                    integration: {}
                }
            });

            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    animeList: {
                        createMany: {
                            data: [
                                ...{
                                    *[Symbol.iterator]() {
                                        for (let i = 0; i < 10; i++)
                                            yield Object({
                                                status: 'completed',
                                                isFavorite: false,
                                                watchedEpisodes: 1,
                                                animeId:
                                                    animesId[
                                                        Math.floor(Math.random() * animesId.length)
                                                    ],
                                                rating: random(0, 10)
                                            });
                                    }
                                }
                            ]
                        }
                    }
                }
            });
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
