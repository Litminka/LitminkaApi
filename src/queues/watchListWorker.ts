import { Worker, Job } from 'bullmq';
import WatchListService from '../services/WatchListService';

const worker = new Worker("importWatchList", async (job: Job) => {
    try {
        await WatchListService.importListV2(job.data.id);
    } catch (error) {
        console.error(error);
    }
    console.log('я обосрався')
}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
    }
});