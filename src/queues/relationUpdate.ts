
import { Queue, Worker, Job } from 'bullmq';
import { logger } from "@/loggerConf"
import AnimeUpdateService from '@/services/anime/AnimeUpdateService';
import { config } from '@/config';

const shikimoriCheckQueue = new Queue("relationUpdate", {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
    }
});

const worker = new Worker("relationUpdate", async (job: Job) => {
    try {
        await AnimeUpdateService.updateRelations();
    } catch (error) {
        logger.error(error);
        logger.error("relationUpdate Failed");
    }

    logger.info("finished");
    return "finished";

}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
    }
});


// shikimoriCheckQueue.add("relationUpdate", {}, {
//     repeat: {
//         every: 1000 * 1000
//     },
//     removeOnComplete: 10,
//     removeOnFail: 100
// })

shikimoriCheckQueue.add("relationUpdate", {}, {
    removeOnComplete: 10,
    removeOnFail: 100,
    repeat: config.updateShikimoriSchedule
})