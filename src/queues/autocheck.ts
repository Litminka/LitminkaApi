import { Queue, Worker, Job } from 'bullmq';
import dayjs from 'dayjs';
import { Server } from 'http';
import { prisma } from "../db";
import { getCurrentSeasonEnd, getPreviousSeasonStart, getSeason } from '../helper/animeseason';
import ShikimoriApi from '../helper/shikimoriapi';
import { ServerError, ShikimoriAnime } from '../ts/index';

const autoCheckQueue = new Queue("autocheck", {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
    }
});

const worker = new Worker("autocheck", async (job: Job) => {
    console.log("started a job");
    const follows = await prisma.follow.findMany({
        include: {
            translation: true
        },
        distinct: ["anime_id"]
    });
    const admin = await prisma.user.findFirstOrThrow({
        where: {
            id: 1,
        },
        include: {
            integration: true
        }
    })
    const shikimoriApi = new ShikimoriApi(admin);
    const date = new Date();
    const prevSeasonStart = getPreviousSeasonStart(date);
    const currentSeasonEnd = getCurrentSeasonEnd(date)

    const prevSeasonString = `${getSeason(prevSeasonStart)}_${prevSeasonStart.getFullYear()}`;
    const currentSeasonString = `${getSeason(currentSeasonEnd)}_${currentSeasonEnd.getFullYear()}`;
    let page = 0;
    const checkAnime: ShikimoriAnime[] = [];
    let seasonString = prevSeasonString;
    do {
        const anime = await shikimoriApi.getSeasonAnimeByPage(page, seasonString);
        if (!anime) throw new Error("Admin account not linked");
        const error = anime as ServerError;
        if (error.reqStatus === 500) throw new Error("Shikimori 500");
        const shikimoriAnime = anime as ShikimoriAnime[];
        if (shikimoriAnime.length == 0 && seasonString != currentSeasonString) {
            seasonString = currentSeasonString
            page = 0;
            continue;
        }
        console.log("test");
        if (shikimoriAnime.length == 0) break
        checkAnime.push(...shikimoriAnime);
        page += 1;
    } while (true);
    console.log(checkAnime.length);
    // Do something with job
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