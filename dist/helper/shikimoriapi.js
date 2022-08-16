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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importStar(require("node-fetch"));
const sleep_1 = __importDefault(require("./sleep"));
const db_1 = require("../db");
const limiter_1 = require("limiter");
const baseUrl = "https://shikimori.one/api";
class ShikimoriApi {
    constructor(user) {
        this.user = user;
        this.limiter = new limiter_1.RateLimiter({ tokensPerInterval: 3, interval: "sec" });
    }
    /**
     * Renew tokens or get fresh ones from shikimori
     * @returns Promise<void | false> if token is imposible to get
     */
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            let token = null;
            if (this.user.integration.shikimori_refresh_token === null) {
                token = yield db_1.prisma.shikimori_Link_Token.findFirst({
                    where: {
                        user_id: this.user.id
                    },
                    select: {
                        token: true,
                    }
                });
            }
            const requestBody = new URLSearchParams({
                "grant_type": token ? "authorization_code" : "refresh_token",
                "client_id": process.env.shikimori_client_id,
                "client_secret": process.env.shikimori_client_secret,
            });
            // If token exists then we assume user has just linked shikimori
            if (token) {
                requestBody.append("code", this.user.integration.shikimori_code);
                requestBody.append("redirect_uri", `https://api.litminka.ru:8001/shikimori/link?token=${token.token}`);
            }
            else {
                requestBody.append("refresh_token", this.user.integration.shikimori_refresh_token);
            }
            const response = yield (0, node_fetch_1.default)("https://shikimori.one/oauth/token", {
                method: "POST",
                headers: {
                    "User-Agent": process.env.shikimori_agent,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: requestBody
            });
            const { status } = response;
            // Sloppy protection against multiple requests
            if (status === 429) {
                yield (0, sleep_1.default)(200);
                return this.getToken();
            }
            /*
                If token is invalid
                Assume user has dropped the integration
                Do the same on our end
            */
            if (status === 400) {
                yield db_1.prisma.integration.update({
                    where: {
                        user_id: this.user.id
                    },
                    data: {
                        shikimori_token: null,
                        shikimori_refresh_token: null,
                        shikimori_code: null,
                    }
                });
                return false;
            }
            const data = yield response.json();
            const integrationBody = { shikimori_token: data.access_token };
            // If user doesn't have a refresh token, add it
            if (token)
                integrationBody.shikimori_refresh_token = data.refresh_token;
            this.user.integration = yield db_1.prisma.integration.update({
                where: {
                    user_id: this.user.integration.user_id
                },
                data: integrationBody
            });
        });
    }
    /**
     * Make a request to shikimori api, supports authorization and retries for failed requests
     *
     * @param url The url to which the request will be made.
     * Param is assumed to be a non full uri starting from https://shikimori.one/api
     *
     * @param method The HTTP method of the request
     *
     * @param auth By default is false, not reqired. Pass true if authentication on shikimori is reqired for this request
     *
     * @param requestdata By default is null. Pass object body if request is not GET
     *
     * @returns result data from the request
     * @returns SsrverError object if request fails
     * @returns false is request is unable to be made due to auth reqirement
     */
    requestMaker(url, method, auth = false, requestdata = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.user.integration === null || this.user.integration.shikimori_code === null)
                return false;
            if (this.user.integration.shikimori_token === null && auth) {
                const result = yield this.getToken();
                if (result === false)
                    return false;
            }
            ;
            let requestStatus = 200;
            do {
                yield this.limiter.removeTokens(1);
                if (requestStatus === 401 && auth) {
                    const result = yield this.getToken();
                    if (result === false)
                        return false;
                }
                ;
                const headers = new node_fetch_1.Headers();
                headers.append("User-Agent", process.env.shikimori_agent);
                if (auth)
                    headers.append("Authorization", `Bearer ${this.user.integration.shikimori_token}`);
                const options = {
                    method, headers
                };
                if (method !== "GET")
                    options.body = requestdata;
                const response = yield (0, node_fetch_1.default)(`${baseUrl}${url}`, options);
                const { status } = response;
                if (status === 500)
                    return { status: 500, message: "Server error" };
                if (status !== 429) {
                    const data = yield response.json();
                    data.reqStatus = status;
                    if (status !== 401)
                        return data;
                }
                requestStatus = status;
            } while (requestStatus === 401 || requestStatus == 429);
        });
    }
    getProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.requestMaker("/users/whoami", "GET", true);
            //FIXME: Low priority! Look into possibility of fixing instant reattach
            // Maybe delete link token from db?
        });
    }
    getAnimeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.requestMaker(`/animes/${id}`, "GET");
        });
    }
    getUserList() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.user.integration.shikimori_id === null)
                return false;
            return this.requestMaker(`/v2/user_rates?user_id=${this.user.integration.shikimori_id}&target_type=Anime`, "GET");
        });
    }
    getBatchAnime(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const animeids = ids.join(",");
            return this.requestMaker(`/animes?ids=${animeids}&limit=50`, "GET");
        });
    }
}
exports.default = ShikimoriApi;
//# sourceMappingURL=shikimoriapi.js.map