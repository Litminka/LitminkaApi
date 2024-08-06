import { Worker } from 'bullmq';
import AnimeUpdateService from '@services/anime/AnimeUpdateService';
import { logger } from '@/loggerConf';
import { ratingUpdateQueue } from './queues';
import config from '@/config';

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
            host: config.redisHost,
            port: parseInt(config.redisPort!)
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
