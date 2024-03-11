import { Worker, Job } from 'bullmq';
import WatchListService from '../services/WatchListService';

const worker = new Worker("importWatchList", async (job: Job) => {
    await WatchListService.importListByUserId(job.data.id);
}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
    }
});