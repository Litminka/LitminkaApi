import { Queue } from 'bullmq';

const importWatchListQueue = new Queue("importWatchList", {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
    }
});

export { importWatchListQueue }