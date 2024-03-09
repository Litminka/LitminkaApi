import { Queue, Worker, Job } from 'bullmq';
import WatchListService from '../services/WatchListService';

const importWatchListQueue = new Queue("importWatchListImport", {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
    }
});

const worker = new Worker("importWatchListImport", async (job: Job) => {
    await WatchListService.importListByUserId(job.data.id);
}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
    }
});

export { importWatchListQueue }