
import { Queue, Worker, Job } from 'bullmq';
import { prisma } from "../db";
import AutoCheckService from '../services/AutoCheckService';
import FollowService from '../services/FollowService';
import { KodikAnimeFull, checkAnime } from '../ts/kodik';

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


    console.log("started a job");
    const started = Date.now();
    const follows = await prisma.follow.findMany({
        where: {
            status: "follow",
        },
        select: {
            status: true,
            user_id: true,
            anime: {
                select: {
                    shikimori_id: true
                }
            },
            translation: true
        },
    });
    const followService = new FollowService();
    const autoCheckService = new AutoCheckService();

    const announcements = await prisma.follow.findMany({
        where: {
            status: "announcement"
        },
        select: {
            status: true,
            user_id: true,
            anime: {
                select: {
                    shikimori_id: true
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
    console.log(`Got basic check anime, amount: ${defaultAnime.length}`)

    const followedAnime = await autoCheckService.getAnime(followIds);
    console.log(`Got follows, amount: ${followedAnime.length}`)

    const announcedAnime = await autoCheckService.getAnime(announcementsIds)
    console.log(`Got announcements, amount: ${announcedAnime.length}`)

    console.log(`Getting anime from kodik`);
    const kodikDefaultAnime = await autoCheckService.getKodikAnime(defaultAnime);
    console.log(`Got kodik anime, amount: ${kodikDefaultAnime.length}`)

    console.log(`Getting anime from kodik`);
    const kodikFollowedAnime = await autoCheckService.getKodikAnime(followedAnime);
    console.log(`Got kodik anime, amount: ${kodikFollowedAnime.length}`)
    const kodikAnimeMap = new Map<number, KodikAnimeFull>()
    for (const anime of [...kodikDefaultAnime, ...kodikFollowedAnime]) {
        kodikAnimeMap.set(parseInt(anime.shikimori_id), anime)
    }
    const ids = [...followIds, ...announcementsIds, ...defaultAnime.map(anime => anime.id)];
    const anime = await prisma.anime.findMany({
        where: {
            shikimori_id: {
                in: ids
            }
        },
        include: {
            anime_translations: true
        }
    });
    const animeMap = new Map<number, checkAnime>();
    for (const anim of anime) animeMap.set(anim.shikimori_id, anim);

    const checkedIds: number[] = [];
    for (const anime of [...defaultAnime, ...followedAnime, ...announcedAnime]) {

        const { id } = anime;
        if (checkedIds.includes(id)) {
            continue;
        }
        let follow = followsMap.get(id);
        if (typeof follow === "undefined") {
            follow = announcementMap.get(id);
        }
        const dbAnime = animeMap.get(id);
        const kodikAnime = kodikAnimeMap.get(id);
        checkedIds.push(id);
        try {
            autoCheckService.checkAnime(anime, kodikAnime, follow, dbAnime);
        } catch (error) {
            console.log(error);
        }
    }

    // Do something with job
    const finished = Date.now();
    console.log(`Finished in: ${(finished - started) / 1000} seconds`)
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