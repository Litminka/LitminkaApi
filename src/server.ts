import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';
import process from 'node:process';
import { logger } from '@/loggerConf';

// NodeJS cluster is not ready at the moment, use at your own risk

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
    logger.info(`Primary ${process.pid} is running`);

    require('@/index');

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code) => {
        logger.error(`Stopped worker ${worker.id}: [${worker.process.pid}] with exit ${code}`);
    });
} else {
    logger.info(`Worker ${process.pid} started`);

    require('@/queues/autocheckWorker');
    require('@/queues/ratingUpdateWorker');
    require('@/queues/relationUpdateWorker');
}
