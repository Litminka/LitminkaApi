
import { Queue, Worker, Job } from 'bullmq';
import prisma from "@/db";
import { Anime } from '@prisma/client';
import { ServerError, ShikimoriAnimeFull } from '@/ts';
import AnimeUpdateService from '@services/anime/AnimeUpdateService';
import { RequestStatuses } from '@/ts/enums';
import { logger } from "@/loggerConf"

const ratingUpdateQueue = new Queue("ratingUpdate", {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
    }
});

const worker = new Worker("ratingUpdate", async (job: Job) => {
    await AnimeUpdateService.updateRating()
}, {
    connection: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT!),
    }
});



ratingUpdateQueue.add("ratingUpdate", {}, {
    removeOnComplete: 10,
    removeOnFail: 100
})