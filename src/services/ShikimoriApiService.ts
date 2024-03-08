import { User, Integration } from "@prisma/client";
import fetch, { Headers } from "node-fetch";
import { options, ShikimoriWhoAmI, RequestTypes, ServerError, ShikimoriWatchList, ShikimoriAnime, ShikimoriAnimeFull } from "../ts/index";
import { prisma } from '../db';
import { shikiRateLimiter } from "../shikiRateLimiter";
import { RateLimiter } from "limiter";
import { RequestStatuses } from "../ts/enums";
interface iShikimoriApi {
    user: User & {
        integration: Integration | null
    } | undefined,
    limiter: RateLimiter
}

const baseUrl = `${process.env.SHIKIMORI_URL}/api`;
export default class ShikimoriApiService implements iShikimoriApi {
    user: User & { integration: Integration | null } | undefined;
    limiter: RateLimiter;
    constructor(user: User & { integration: Integration | null } | undefined = undefined) {
        this.user = user;
        this.limiter = shikiRateLimiter;
    }

    /**
     * Renew tokens or get fresh ones from shikimori
     * @returns Promise(Boolean) meaning success of operation
     */
    private async getToken(): Promise<boolean> {
        let token = null;
        if (!this.user) return false;
        if (this.user.integration!.shikimori_refresh_token === null) {
            token = await prisma.shikimori_Link_Token.findFirst({
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
            "client_id": process.env.SHIKIMORI_CLIENT_ID!,
            "client_secret": process.env.SHIKIMORI_CLIENT_SECRET!,
        });
        // If token exists, then we assume user has just linked shikimori
        if (token) {
            requestBody.append("code", this.user.integration!.shikimori_code!);
            requestBody.append("redirect_uri", `${process.env.APP_URL}/shikimori/link?token=${token!.token}`);
        } else {
            requestBody.append("refresh_token", this.user.integration!.shikimori_refresh_token!)
        }
        const response = await fetch(`${process.env.SHIKIMORI_URL}/oauth/token`, {
            method: "POST",
            headers: {
                "User-Agent": process.env.SHIKIMORI_AGENT!,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: requestBody
        });
        const { status } = response;
        // Sloppy protection against multiple requests
        if (status === RequestStatuses.TooManyRequests) {
            await this.limiter.removeTokens(1);
            return this.getToken();
        }
        /* 
            If refresh token on backend is invalid
            Assume user has dropped the integration
            Do the same on our end
        */
        if (status === RequestStatuses.BadRequest) {
            await prisma.integration.update({
                where: {
                    user_id: this.user.id
                },
                data: {
                    shikimori_token: null,
                    shikimori_refresh_token: null,
                    shikimori_id: null,
                    shikimori_code: null,
                }
            });
            return false;
        }
        const data: any = await response.json();
        const integrationBody: any = { shikimori_token: data.access_token }
        // If user doesn't have a refresh token, add it
        if (token) integrationBody.shikimori_refresh_token = data.refresh_token;
        this.user.integration = await prisma.integration.update({
            where: {
                user_id: this.user.integration!.user_id
            },
            data: integrationBody
        });
        return true;
    }
    /**
     * Make a request to shikimori api, supports authorization and retries for failed requests
     * 
     * @param url The url to which the request will be made.
     * Param is assumed to be a non full uri starting from https://shikimori.one/api
     * 
     * @param method The HTTP method of the request
     * 
     * @param auth By default is false and is not required. Pass true if authentication on shikimori is required for this request
     * 
     * @param requestData By default is null. Pass object body if request is not GET
     * 
     * @returns result data from the request
     * @returns ServerError object if request fails
     * @returns false is request is unable to be made due to auth requirement
     */
    private async requestMaker(url: string, method: RequestTypes, auth = false, requestData = null) {
        if (auth) {
            if (!this.user) return false;
            if (this.user.integration === null || this.user.integration.shikimori_code === null) return false;
            if (this.user.integration.shikimori_token === null) {
                const result = await this.getToken();
                if (result === false) return false;
            };
        }
        let requestStatus: number = RequestStatuses.OK;
        do {
            await this.limiter.removeTokens(1);
            if (requestStatus === RequestStatuses.Unauthorized && auth) {
                const result = await this.getToken();
                if (!result) return false;
            };
            const headers = new Headers();

            headers.append("User-Agent", process.env.SHIKIMORI_AGENT!);
            if (auth) headers.append("Authorization", `Bearer ${this.user!.integration!.shikimori_token}`);
            const options: options = {
                method, headers
            };
            if (method !== "GET") options.body = requestData;
            const response = await fetch(`${baseUrl}${url}`, options);
            const { status } = response;
            if (status === RequestStatuses.InternalServerError) return { status: RequestStatuses.InternalServerError, message: "Server error" };
            if (status !== RequestStatuses.TooManyRequests) {
                const data: any = await response.json();
                data.reqStatus = status;
                if (status !== RequestStatuses.Unauthorized) return data;
            }
            requestStatus = status;
        } while (requestStatus === RequestStatuses.Unauthorized || requestStatus === RequestStatuses.TooManyRequests);
    }

    public async getProfile(): Promise<ShikimoriWhoAmI | ServerError | false> {
        return this.requestMaker("/users/whoami", "GET", true);
    }

    public async getAnimeById(id: number): Promise<ShikimoriAnimeFull | ServerError> {
        return this.requestMaker(`/animes/${id}`, "GET");
    }

    public async getUserList(): Promise<ShikimoriWatchList[] | ServerError | false> {
        if (!this.user) return false;
        if (this.user.integration!.shikimori_id === null) return false;
        return this.requestMaker(`/v2/user_rates?user_id=${this.user.integration!.shikimori_id}&target_type=Anime`, "GET");
    }

    public async getBatchAnime(ids: number[]): Promise<ShikimoriAnime[] | ServerError> {
        const animeIds = ids.join(",");
        return this.requestMaker(`/animes?ids=${animeIds}&limit=50`, "GET");
    }

    public async getSeasonAnimeByPage(page: number, season: string): Promise<ShikimoriAnime[] | ServerError> {
        return this.requestMaker(`/animes?limit=50&season=${season}&page=${page}`, "GET");
    }
}