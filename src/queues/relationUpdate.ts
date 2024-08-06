import { Worker } from 'bullmq';
import { logger } from '@/loggerConf';
import AnimeUpdateService from '@services/anime/AnimeUpdateService';
import { shikimoriCheckQueue } from './queues';
import config from '@config';

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
            host: config.redisHost,
            port: parseInt(config.redisPort!)
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
