import express, { Express, NextFunction, Request, Response } from 'express';
const helmet = require("helmet");
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { userRouter } from './routes/UserRouter';
import { shikimoriRouter } from './routes/ShikimoriRouter';
import { tokenRouter } from './routes/TokenRouter';
import { watchListRouter } from './routes/WatchListRouter';
import { followRouter } from './routes/FollowRouter';
import { animeRouter } from './routes/AnimeRouter';
import * as fs from 'fs';
import * as https from 'https';
import * as http from 'http';
import { RequestStatuses } from './ts/enums';
import { wrap } from './middleware/errorHandler';
import { logger } from './loggerConf'

dotenv.config();

const app: Express = express();
const port: string | undefined = process.env.PORT;

if (!process.env.shikimori_agent) throw new Error("No agent specified in ENV");
if (!process.env.shikimori_client_id) throw new Error("No client id specified in ENV");
if (!process.env.shikimori_client_secret) throw new Error("No client secret specified in ENV");
if (!process.env.shikimori_url) throw new Error("Shikimori base url is not specified");
if (!process.env.app_url) throw new Error("App Url not specified");


app.use(helmet());
app.use((req, res, next) => {
    bodyParser.json()(req, res, (err) => {
        if (err) return res.status(RequestStatuses.BadRequest).json({
            error: err.message
        })
        next();
    });
});
app.use(bodyParser.urlencoded({ extended: true }));

function helloWorld(req: Request, res: Response) {
    res.json({
        res: "Hello world!"
    });
}

app.get('/', wrap(helloWorld));

app.use("/users", userRouter);
app.use("/watch-list", watchListRouter);
app.use("/anime", animeRouter);
app.use("/anime/follow", followRouter);
app.use("/shikimori", shikimoriRouter);
app.use("/token", tokenRouter);

app.get("/shikimori_token", (req: Request, res: Response) => {
    logger.debug(`shikimori_token ${req.query}`)
})

if (process.env.ssl) {
    http.createServer(app).listen(port, () => {
        logger.info(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
} else {
    const httpsOptions = {
        key: fs.readFileSync(process.env.ssl_key as string),
        cert: fs.readFileSync(process.env.ssl_cert as string)
    }
    https.createServer(httpsOptions, app).listen(port, () => {
        logger.info(`⚡️[server]: Server is running at https://localhost:${port}`);
    });
}
