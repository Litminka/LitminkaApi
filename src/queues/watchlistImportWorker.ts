import { logger } from '@/loggerConf';
import { Job, Worker } from 'bullmq';
import WatchListService from '@services/WatchListService';
import config from '@/config';

new Worker(
    'watchlistImport',
    async (job: Job) => {
        const started = Date.now();
        logger.info(`[watchlistImport]: Started job`);
        try {
            await WatchListService.import(job.data.id);
        } catch (error) {
            logger.error('[watchlistImport]:', error);
            throw error;
        }
        const finished = Date.now();

        logger.info(`[watchlistImport]: Finished in: ${(finished - started) / 1000} seconds`);
    },
    {
        connection: {
            host: config.redisHost,
            port: parseInt(config.redisPort!)
        }
    }
);
