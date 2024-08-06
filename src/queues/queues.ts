import { Queue } from 'bullmq';
import config from '@/config';

const connection = {
    connection: {
        host: config.redisHost,
        port: parseInt(config.redisPort!)
    }
};

export const autoCheckQueue = new Queue('autocheck', connection);

export const ratingUpdateQueue = new Queue('ratingUpdate', connection);

export const shikimoriCheckQueue = new Queue('relationUpdate', connection);

export const importWatchListQueue = new Queue('importWatchList', connection);

export const shikimoriListUpdateQueue = new Queue('shikimoriListUpdate', connection);
