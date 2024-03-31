import { logger } from '@/loggerConf';
import { Job, Worker } from "bullmq";
import WatchListService from "@services/WatchListService";

const worker = new Worker("shikimoriListUpdate", async (job: Job) => {
    const data = job.data;
    try {
        if (data.type === "add-update") {
            await WatchListService.importListV2(job.data.id);
        }
        if (data.type === "delete") {
            await WatchListService.importListByUser(123);
        }
    } catch (error) {
        logger.error("ListUpdate has failed! Error" + error);
    }
}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
    }
});