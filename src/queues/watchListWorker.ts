import { Worker, Job } from 'bullmq';
import WatchListService from '../services/WatchListService';
import { logger } from '../loggerConf';

const worker = new Worker("importWatchList", async (job: Job) => {
    const started = Date.now();
    try {
        await WatchListService.importListV2(job.data.id);
    } catch (error) {
        logger.error("ImportList has failed! Error" + error);
    }
    const finished = Date.now();
    logger.info(`Finished in: ${(finished - started) / 1000} seconds`)
    console.log('я обосрався')
}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
    }
});