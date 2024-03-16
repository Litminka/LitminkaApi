
import { Queue, Worker, Job } from 'bullmq';
import prisma from "@/db";
import AutoCheckService from '@services/AutoCheckService';
import FollowService from '@services/FollowService';
import { KodikAnimeFull, checkAnime } from '@/ts/kodik';
import KodikApiService from '@services/KodikApiService';
import { FollowTypes } from '@/ts/enums';
import { logger } from "@/loggerConf"

const autoCheckQueue = new Queue("autocheck", {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
    }
});

const worker = new Worker("autocheck", async (job: Job) => {
    // get titles
    // sort titles as pairs with users
    // separate follow types
    // request all from shikimori
    // request follows from shikimori

    // request titles from kodik
    // separate titles into array
    // check each title
    // send notification
    // update title

    logger.info("started a job");
    logger.info("updating translations");
    const kodikApi = new KodikApiService()
    const translations = await kodikApi.getTranslationGroups();
    for (const translation of translations) {
        await prisma.group.upsert({
            where: {
                id: translation.id,
            },
            create: {
                id: translation.id,
                name: translation.title,
                type: translation.type,
            },
            update: {
                id: translation.id,
                name: translation.title,
                type: translation.type,
            }
        })

    }
    const started = Date.now();
    const follows = await prisma.follow.findMany({
        where: {
            status: FollowTypes.Follow,
        },
        select: {
            status: true,
            userId: true,
            anime: {
                select: {
                    shikimoriId: true
                }
            },
            translation: true
        },
    });
    const followService = new FollowService();
    const autoCheckService = new AutoCheckService();

    const announcements = await prisma.follow.findMany({
        where: {
            status: FollowTypes.Announcement
        },
        select: {
            status: true,
            userId: true,
            anime: {
                select: {
                    shikimoriId: true
                }
            }
        },
    })
    const followsMap = followService.getFollowsMap(follows);
    console.dir(followsMap);
    const announcementMap = followService.getFollowsMap(announcements);
    console.dir(announcementMap);
    const followIds = [...followsMap.keys()];
    const announcementsIds = [...announcementMap.keys()];
    const defaultAnime = await autoCheckService.getDefaultAnime();
    logger.info(`Got basic check anime, amount: ${defaultAnime.length}`)

    const followedAnime = await autoCheckService.getAnime(followIds);
    logger.info(`Got follows, amount: ${followedAnime.length}`)

    const announcedAnime = await autoCheckService.getAnime(announcementsIds)
    logger.info(`Got announcements, amount: ${announcedAnime.length}`)

    logger.info(`Getting anime from kodik`);
    const kodikDefaultAnime = await autoCheckService.getKodikAnime(defaultAnime);
    logger.info(`Got kodik anime, amount: ${kodikDefaultAnime.length}`)

    logger.info(`Getting anime from kodik`);
    const kodikFollowedAnime = await autoCheckService.getKodikAnime(followedAnime);
    logger.info(`Got kodik anime, amount: ${kodikFollowedAnime.length}`)
    const kodikAnimeMap = new Map<number, KodikAnimeFull>()
    for (const anime of [...kodikDefaultAnime, ...kodikFollowedAnime]) {
        kodikAnimeMap.set(parseInt(anime.shikimori_id), anime)
    }
    const ids = [...followIds, ...announcementsIds, ...defaultAnime.map(anime => anime.id)];
    const anime = await prisma.anime.findMany({
        where: {
            shikimoriId: {
                in: ids
            }
        },
        include: {
            animeTranslations: true
        }
    });
    const animeMap = new Map<number, checkAnime>();
    for (const anim of anime) animeMap.set(anim.shikimoriId, anim);

    const checkedIds: number[] = [];
    for (const anime of [...defaultAnime, ...followedAnime, ...announcedAnime]) {

        const { id } = anime;
        if (checkedIds.includes(id)) {
            continue;
        }
        let follow = followsMap.get(id);
        if (follow === undefined) {
            follow = announcementMap.get(id);
        }
        const dbAnime = animeMap.get(id);
        const kodikAnime = kodikAnimeMap.get(id);
        checkedIds.push(id);
        try {
            autoCheckService.checkAnime(anime, kodikAnime, follow, dbAnime);
        } catch (error) {
            logger.error(error);
        }
    }

    // Do something with job
    const finished = Date.now();
    logger.info(`Finished in: ${(finished - started) / 1000} seconds`)
    return 'some value';
}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
    }
});


// autoCheckQueue.add("autocheck", {}, {
//     repeat: {
//         every: 1000 * 1000
//     },
//     removeOnComplete: 10,
//     removeOnFail: 100
// })

autoCheckQueue.add("autocheck", {}, {
    removeOnComplete: 10,
    removeOnFail: 100
})