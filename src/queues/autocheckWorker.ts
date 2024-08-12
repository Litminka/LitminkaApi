import { Worker } from 'bullmq';
import { logger } from '@/loggerConf';
import config from '@config';
import AutoCheckService from '@/http/services/AutoCheckService';

/**
 * get titles ->
 * sort titles as pairs with users ->
 * separate follow types ->
 * request all from shikimori ->
 * request follows from shikimori
 *
 * request titles from kodik ->
 * separate titles into array ->
 * check each title ->
 * send notification ->
 * update title
 */
new Worker(
    'autocheck',
    async () => {
        const started = Date.now();

        logger.info(`[autocheck]: Started job`);
        try {
            await new AutoCheckService().runAutocheck();
        } catch (error) {
            logger.error('[autocheck]', error);
            throw error;
        }

        logger.info(`[autocheck]: Finished in: ${(Date.now() - started) / 1000} seconds`);
    },
    {
        connection: {
            host: config.redisHost,
            port: parseInt(config.redisPort!)
        }
    }
);
