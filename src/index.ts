import express, { Express, Request, Response } from 'express';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const helmet = require('helmet');
import bodyParser from 'body-parser';
import * as fs from 'fs';
import * as https from 'https';
import * as http from 'http';

import { RequestStatuses } from '@enums';
import { wrap } from '@/middleware/errorHandler';
import { logger } from '@/loggerConf';

import { userRouter } from '@/routers/UserRouter';
import { shikimoriRouter } from '@/routers/ShikimoriRouter';
import { tokenRouter } from '@/routers/TokenRouter';
import { watchListRouter } from '@/routers/WatchListRouter';
import { followRouter } from '@/routers/FollowRouter';
import { animeRouter } from '@/routers/AnimeRouter';
import { groupListRouter } from '@/routers/GroupListRouter';
import { notificationRouter } from '@/routers/NotificationRouter';
import { adminRouter } from '@/routers/AdminRouter';
import config from '@/config';

// Import background workers
import '@/queues/autocheckWorker';
import '@/queues/ratingUpdateWorker';
import '@/queues/relationUpdateWorker';
import '@/queues/shikimoriSyncWorker';
import '@/queues/watchlistImportWorker';

export const app: Express = express();

const port: string = config.appPort;
if (!config.shikimoriAgent) throw new Error('No agent specified in ENV');
if (!config.shikimoriClientId) throw new Error('No client id specified in ENV');
if (!config.shikimoriClientSecret) throw new Error('No client secret specified in ENV');
if (!config.shikimoriUrl) throw new Error('Shikimori base url is not specified');
if (!config.appUrl) throw new Error('App Url not specified');

app.use(helmet());
app.use((req, res, next) => {
    bodyParser.json()(req, res, (err) => {
        if (err)
            return res.status(RequestStatuses.BadRequest).json({
                error: err.message
            });
        next();
    });
});
app.use(bodyParser.urlencoded({ extended: true }));

function helloWorld(req: Request, res: Response) {
    res.json({
        res: 'Hello world!'
    });
}

app.get('/', wrap(helloWorld));

app.use('/users', userRouter);
app.use('/watch-list', watchListRouter);
app.use('/group-list', groupListRouter);
app.use('/anime', animeRouter);
app.use('/anime/follow', followRouter);
app.use('/shikimori', shikimoriRouter);
app.use('/token', tokenRouter);
app.use('/notifications', notificationRouter);
app.use('/admin', adminRouter);

app.get('/shikimori_token', (req: Request) => {
    logger.debug(`shikimori_token ${req.query}`);
});

const welcome = '⚡️[server]: Server is running at: ';
switch (config.ssl) {
    case true: {
        const httpsOptions = {
            key: fs.readFileSync(config.sslKey),
            cert: fs.readFileSync(config.sslCert)
        };
        https.createServer(httpsOptions, app).listen(port, () => {
            logger.info(welcome + `https://localhost:${port}`);
        });
        break;
    }

    case false: {
        http.createServer(app).listen(port, () => {
            logger.info(welcome + `http://localhost:${port}`);
        });
        break;
    }

    default:
        throw new Error('SSL parameter must be bool');
}

import '@/queues/queues';
