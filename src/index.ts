import express, { Express, Request, Response } from 'express';
const helmet = require("helmet");
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { userRouter } from './routes/UserRouter';
import { shikimoriRouter } from './routes/ShikimoriRouter';
import { tokenRouter } from './routes/TokenRouter';
import { watchListRouter } from './routes/WatchListRouter';
import { followRouter } from './routes/FollowRouter';
import path from 'path';
import * as fs from 'fs';
import * as https from 'https';
import { animeRouter } from './routes/AnimeRouter';

dotenv.config();
const app: Express = express();
const port: string | undefined = process.env.PORT;

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req: Request, res: Response) => {
    res.json({
        res: "Hello world!"
    });
});

app.use("/users", userRouter);
app.use("/watch-list", watchListRouter);
app.use("/anime", animeRouter);
app.use("/anime/follow", followRouter);
app.use("/shikimori", shikimoriRouter);
app.use("/token", tokenRouter);

app.get("/shikimori_token", (req: Request, res: Response) => {
    console.log(req.query);
})

const key = fs.readFileSync(path.join(__dirname, "..", "cert", "f", "localhost", "localhost.decrypted.key"));
const cert = fs.readFileSync(path.join(__dirname, "..", "cert", "f", "localhost", "localhost.crt"));

https.createServer({ key, cert }, app).listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});