import { PrismaClient } from '@prisma/client'
import { logger } from '../src/loggerConf'
const prisma = new PrismaClient()
import dotenv from 'dotenv';
dotenv.config();
import { Encrypt } from "../src/helper/encrypt";
import capitalize from "../src/helper/capitalize";
import KodikApiService from "../src/services/KodikApiService";
async function main() {
    const adminRole = await prisma.role.upsert({
        where: { name: "admin" },
        update: {},
        create: {
            name: "admin",
            permissions: {
                connectOrCreate: [
                    {
                        where: { name: "manage_anime" },
                        create: {
                            name: "manage_anime"
                        },
                    },
                    {
                        where: { name: "view_lists" },
                        create: {
                            name: "view_lists"
                        },
                    },
                    {
                        where: { name: "sync_shikimori" },
                        create: {
                            name: "sync_shikimori"
                        },
                    },
                ]
            }
        }
    })
    const userRole = await prisma.role.upsert({
        where: { name: "user" },
        update: {},
        create: {
            name: "user",
        }
    })
    const admin = await prisma.user.upsert({
        where: { email: 'admin@admin.ru' },
        update: {},
        create: {
            email: "admin@admin.ru",
            login: process.env.ROOT_LOGIN!,
            password: await Encrypt.cryptPassword(process.env.ROOT_PASS!),
            name: "Admin",
            role: {
                connect: {
                    id: adminRole.id
                }
            }
        },
    });
    const user = await prisma.user.upsert({
        where: { email: 'user@user.ru' },
        update: {},
        create: {
            email: "user@user.ru",
            login: "User",
            password: await Encrypt.cryptPassword("password"),
            name: "user",
            role: {
                connect: {
                    id: userRole.id
                }
            }
        },
    });
    console.dir(admin);
    console.dir(user);
    const kodik = new KodikApiService();
    const genres = await kodik.getGenres();
    // Test new logger
    if (genres.reqStatus === 500) return logger.error(genres);
    const { results } = genres;
    results.forEach(async genre => {
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
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })