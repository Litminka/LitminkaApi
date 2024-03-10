
import { Queue, Worker, Job } from 'bullmq';
import { prisma } from "../db";
import { Anime } from '@prisma/client';
import ShikimoriApiService from '../services/shikimori/ShikimoriApiService';
import { ServerError, ShikimoriAnimeFull } from '../ts';
import AnimeUpdateService from '../services/AnimeUpdateService';
import { RequestStatuses } from '../ts/enums';
import { logger } from "../loggerConf"

const shikimoriCheckQueue = new Queue("shikimoriUpdate", {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
    }
});

const worker = new Worker("shikimoriUpdate", async (job: Job) => {
    const anime = await prisma.anime.findMany({
        where: {
            OR: [
                {
                    franchiseName: null
                },
                {
                    japaneseName: null,
                }
            ]
        }
    });
    const checkMap = new Map<number, Anime>();
    for (const single of anime) {
        checkMap.set(single.id, single);
    }
    const shikimoriApi = new ShikimoriApiService();
    const shikimoriAnimeFull: ShikimoriAnimeFull[] = []
    for (const single of anime) {
        const req = await shikimoriApi.getAnimeById(single.shikimoriId);
        const error = req as ServerError;
        if (error.reqStatus === RequestStatuses.InternalServerError) {
            throw error;
        }
        shikimoriAnimeFull.push(req as ShikimoriAnimeFull);
        logger.info(`Requesting anime ${single.name} from shikimori`)
    }
    const animeUpdateService = new AnimeUpdateService(shikimoriApi, undefined);
    logger.info("all anime requested, updating")
    await animeUpdateService.updateAnimeShikimoriFull(shikimoriAnimeFull);
    logger.info("finished");
    return "finished";

}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
    }
});


// shikimoriCheckQueue.add("shikimoriUpdate", {}, {
//     repeat: {
//         every: 1000 * 1000
//     },
//     removeOnComplete: 10,
//     removeOnFail: 100
// })

shikimoriCheckQueue.add("shikimoriUpdate", {}, {
    removeOnComplete: 10,
    removeOnFail: 100
})