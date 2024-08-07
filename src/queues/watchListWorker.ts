import { logger } from '@/loggerConf';
import { Job, Worker } from 'bullmq';
import WatchListService from '@services/WatchListService';
import config from '@/config';

new Worker(
    'importWatchList',
    async (job: Job) => {
        const started = Date.now();
        try {
            await WatchListService.import(job.data.id);
        } catch (error) {
            logger.error('ImportList has failed! Error' + error);
            throw error;
        }
        const finished = Date.now();
        logger.info(`Finished in: ${(finished - started) / 1000} seconds`);
    },
    {
        connection: {
            host: config.redisHost,
            port: parseInt(config.redisPort!)
        }
    }
);
