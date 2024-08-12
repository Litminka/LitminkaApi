import { Worker } from 'bullmq';
import AnimeUpdateService from '@services/anime/AnimeUpdateService';
import { logger } from '@/loggerConf';
import config from '@/config';

new Worker(
    'ratingUpdate',
    async () => {
        const started = Date.now();

        logger.info(`[ratingUpdate]: Started job`);
        try {
            await AnimeUpdateService.updateRating();
        } catch (error) {
            logger.error('[ratingUpdate]:', error);
            throw error;
        }

        logger.info(`[ratingUpdate]: Finished in: ${(Date.now() - started) / 1000} seconds`);
    },
    {
        connection: {
            host: config.redisHost,
            port: parseInt(config.redisPort!)
        }
    }
);
