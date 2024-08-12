import { Queue } from 'bullmq';
import config from '@/config';

const connection = {
    connection: {
        host: config.redisHost,
        port: parseInt(config.redisPort!)
    }
};

export const autoCheckQueue = new Queue('autocheck', connection);
autoCheckQueue.add('autocheck', { name: 'autocheck' });

autoCheckQueue.add(
    'autocheck',
    { name: 'autocheck' },
    {
        removeOnComplete: 10,
        removeOnFail: 100,
        repeat: config.autocheckSchedule
    }
);

export const ratingUpdateQueue = new Queue('ratingUpdate', connection);
ratingUpdateQueue.add('ratingUpdate', { name: 'ratingUpdate' });

ratingUpdateQueue.add(
    'ratingUpdate',
    { name: 'ratingUpdate' },
    {
        removeOnComplete: 10,
        removeOnFail: 100,
        repeat: config.ratingUpdateSchedule
    }
);

export const shikimoriCheckQueue = new Queue('relationUpdate', connection);
shikimoriCheckQueue.add('relationUpdate', { name: 'relationUpdate' });

shikimoriCheckQueue.add(
    'relationUpdate',
    { name: 'relationUpdate' },
    {
        removeOnComplete: 10,
        removeOnFail: 100,
        repeat: config.relationUpdateSchedule
    }
);

export const watchListImportQueue = new Queue('watchListImport', connection);

export const shikimoriListSyncQueue = new Queue('shikimoriSync', connection);
