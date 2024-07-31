import { Worker } from 'bullmq';
import { logger } from '@/loggerConf';
import AnimeUpdateService from '@services/anime/AnimeUpdateService';
import { config } from '@config';
import { shikimoriCheckQueue } from './queues';

new Worker(
    'relationUpdate',
    async () => {
        const started = Date.now();
        try {
            await AnimeUpdateService.updateRelations();
        } catch (error) {
            logger.error(error);
            logger.error('relationUpdate Failed');
        }

        const finished = Date.now();
        logger.info(`Finished in: ${(finished - started) / 1000} seconds`);
    },
    {
        connection: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT!)
        }
    }
);

shikimoriCheckQueue.add(
    'relationUpdate',
    {},
    {
        removeOnComplete: 10,
        removeOnFail: 100,
        repeat: config.updateShikimoriSchedule
    }
);
