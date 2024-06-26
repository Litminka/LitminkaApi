import { Worker } from 'bullmq';
import AnimeUpdateService from '@services/anime/AnimeUpdateService';
import { logger } from '@/loggerConf';
import { config } from '@config';
import { ratingUpdateQueue } from './queues';

new Worker(
    'ratingUpdate',
    async () => {
        try {
            await AnimeUpdateService.updateRating();
        } catch (err) {
            logger.error('Rating update failed:', err);
            throw err;
        }
    },
    {
        connection: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT!)
        }
    }
);

ratingUpdateQueue.add(
    'ratingUpdate',
    {},
    {
        removeOnComplete: 10,
        removeOnFail: 100,
        repeat: config.updateRatingSchedule
    }
);
