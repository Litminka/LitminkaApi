import { Worker } from 'bullmq';
import { logger } from '@/loggerConf';
import AnimeUpdateService from '@services/anime/AnimeUpdateService';
import config from '@config';

new Worker(
    'relationUpdate',
    async () => {
        const started = Date.now();

        logger.info(`[relationUpdate]: Started job`);
        try {
            await AnimeUpdateService.updateRelations();
        } catch (error) {
            logger.error('[relationUpdate]:', error);
            throw error;
        }

        logger.info(`[relationUpdate]: Finished in: ${(Date.now() - started) / 1000} seconds`);
    },
    {
        connection: {
            host: config.redisHost,
            port: parseInt(config.redisPort!)
        }
    }
);
