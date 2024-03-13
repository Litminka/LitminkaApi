import { Job, Worker } from "bullmq";
import WatchListService from "../services/WatchListService";

const worker = new Worker("importWatchList", async (job: Job) => {
    await WatchListService.importListByUser(job.data.user);
}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
    }
});