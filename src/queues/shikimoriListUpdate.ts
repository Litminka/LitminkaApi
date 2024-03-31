import { logger } from '@/loggerConf';
import { Job, Worker } from "bullmq";
import ShikimoriListSyncService from '@/services/shikimori/ShikimoriListSyncService';
import ForbiddenError from '@/errors/clienterrors/ForbiddenError';

const worker = new Worker("shikimoriListUpdate", async (job: Job) => {
    const data = job.data;
    try {
        if (data.type === "add-update") {
            await ShikimoriListSyncService.addOrUpdateList(data.userId, data.list);
        }
        if (data.type === "delete") {
            await ShikimoriListSyncService.deleteList(data.userId, data.shikimoriId);
        }
    } catch (error) {
        if (!(error instanceof ForbiddenError)) {
            logger.error("ListUpdate has failed! Error" + error);
            throw error;
        }
    }
}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
    }
});