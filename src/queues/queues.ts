import { Queue } from "bullmq";

const connection = {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
    }
}

export const autoCheckQueue = new Queue("autocheck", connection);

export const ratingUpdateQueue = new Queue("ratingUpdate", connection);

export const shikimoriCheckQueue = new Queue("relationUpdate", connection);

export const importWatchListQueue = new Queue("importWatchList", connection);

export const shikimoriListUpdateQueue = new Queue('shikimoriListUpdate', connection); 