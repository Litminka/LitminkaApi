import { logger } from '@/loggerConf';
import { Job, Worker } from "bullmq";
import WatchListService from "@services/WatchListService";

const worker = new Worker("importWatchList", async (job: Job) => {
    const started = Date.now();
    try {
        await WatchListService.import(job.data.id);
    } catch (error) {
        logger.error("ImportList has failed! Error" + error);
        throw (error);
    }
    const finished = Date.now();
    logger.info(`Finished in: ${(finished - started) / 1000} seconds`)
}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
    }
});