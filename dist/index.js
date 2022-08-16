"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet = require("helmet");
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const UserRouter_1 = require("./routes/UserRouter");
const ShikimoriRouter_1 = require("./routes/ShikimoriRouter");
const TokenRouter_1 = require("./routes/TokenRouter");
const WatchListRouter_1 = require("./routes/WatchListRouter");
const FollowRouter_1 = require("./routes/FollowRouter");
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const https = __importStar(require("https"));
const AnimeRouter_1 = require("./routes/AnimeRouter");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(helmet());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.json({
        res: "Hello world!"
    });
});
app.use("/users", UserRouter_1.userRouter);
app.use("/watch-list", WatchListRouter_1.watchListRouter);
app.use("/anime", AnimeRouter_1.animeRouter);
app.use("/anime/follow", FollowRouter_1.followRouter);
app.use("/shikimori", ShikimoriRouter_1.shikimoriRouter);
app.use("/token", TokenRouter_1.tokenRouter);
app.get("/shikimori_token", (req, res) => {
    console.log(req.query);
});
const key = fs.readFileSync(path_1.default.join(__dirname, "..", "cert", "f", "localhost", "localhost.decrypted.key"));
const cert = fs.readFileSync(path_1.default.join(__dirname, "..", "cert", "f", "localhost", "localhost.crt"));
https.createServer({ key, cert }, app).listen(port, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});
//# sourceMappingURL=index.js.map