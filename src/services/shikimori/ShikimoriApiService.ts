import { User, Integration, Prisma } from "@prisma/client";
import { ShikimoriWhoAmI, RequestTypes, ShikimoriWatchList, ShikimoriAnime, ShikimoriAnimeFull } from "../../ts/index";
import prisma from '../../db';
import { shikiRateLimiter } from "../../shikiRateLimiter";
import { RateLimiter } from "limiter";
import { RequestStatuses } from "../../ts/enums";
import axios, { AxiosHeaders } from "axios";
import BadRequestError from "../../errors/clienterrors/BadRequestError";
import { ShikimoriGraphAnimeRequest, ShikimoriGraphAnimeWithoutRelationRequest } from "../../ts/shikimori";
import { getAnimeBySeasonQuery, getAnimeWithRelationsQuery, getAnimeWithoutRelationQuery } from "../../ts/shikimoriGraphQLRequests";
interface iShikimoriApi {
    user: User & {
        integration: Integration | null
    } | undefined,
    limiter: RateLimiter
}

axios.defaults.validateStatus = (status) => {
    return (status >= 400 && status <= 499) || (status >= 200 && status <= 299)
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
        if (this.user.integration!.shikimoriRefreshToken === null) {
            token = await prisma.shikimoriLinkToken.findFirst({
                where: {
                    userId: this.user.id
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
            requestBody.append("code", this.user.integration!.shikimoriCode!);
            requestBody.append("redirect_uri", `${process.env.APP_URL}/shikimori/link?token=${token!.token}`);
        } else {
            requestBody.append("refresh_token", this.user.integration!.shikimoriRefreshToken!)
        }
        const response = await axios(`${process.env.SHIKIMORI_URL}/oauth/token`, {
            method: "POST",
            headers: {
                "User-Agent": process.env.SHIKIMORI_AGENT!,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: requestBody
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
                    userId: this.user.id
                },
                data: {
                    shikimoriToken: null,
                    shikimoriRefreshToken: null,
                    shikimoriId: null,
                    shikimoriCode: null,
                }
            });
            return false;
        }
        const data: any = await response.data;
        const integrationBody = {
            shikimoriToken: data.access_token,
            shikimoriRefreshToken: undefined
        } satisfies Prisma.IntegrationUpdateInput;
        // If user doesn't have a refresh token, add it
        if (token) integrationBody.shikimoriRefreshToken = data.refresh_token;
        this.user.integration = await prisma.integration.update({
            where: {
                userId: this.user.integration!.userId
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
    private async requestMaker(url: string, method: RequestTypes, auth = false, data?: Object) {
        if (auth) {
            if (!this.user) throw new BadRequestError("no_shikimori_integration");
            if (this.user.integration === null || this.user.integration.shikimoriCode === null) throw new BadRequestError("no_shikimori_integration");
            if (this.user.integration.shikimoriToken === null) {
                const result = await this.getToken();
                if (result === false) throw new BadRequestError("no_shikimori_integration");
            };
        }

        let requestStatus: number = RequestStatuses.OK;
        do {
            await this.limiter.removeTokens(1);
            if (requestStatus === RequestStatuses.Unauthorized && auth) {
                const result = await this.getToken();
                if (!result) throw new BadRequestError("no_shikimori_integration");
            };

            const headers = new AxiosHeaders();

            headers.set("User-Agent", process.env.SHIKIMORI_AGENT!);
            headers.set("Content-Type", "application/json",);

            if (auth) headers.set("Authorization", `Bearer ${this.user!.integration!.shikimoriToken}`);

            const response = await axios(`${baseUrl}${url}`, {
                method: method,
                data,
                headers: headers,
            });

            const { status } = response;

            if (status !== RequestStatuses.TooManyRequests) {
                const data: any = response.data;
                data.reqStatus = status;
                if (status !== RequestStatuses.Unauthorized) return data;
            }

            requestStatus = status;
        } while (requestStatus === RequestStatuses.Unauthorized
            || requestStatus === RequestStatuses.TooManyRequests);
    }

    public async getProfile(): Promise<ShikimoriWhoAmI> {
        return this.requestMaker("/users/whoami", "GET", true);
    }

    public async getUserList(): Promise<ShikimoriWatchList[]> {
        if (!this.user) throw new BadRequestError("no_shikimori_integration");
        if (this.user.integration!.shikimoriId === null) throw new BadRequestError("no_shikimori_integration");
        return this.requestMaker(`/v2/user_rates?user_id=${this.user.integration!.shikimoriId}&target_type=Anime&censored=true`, "GET");
    }

    /**
     * @deprecated
     * @param id 
     * @returns 
     */
    public async getAnimeById(id: number): Promise<ShikimoriAnimeFull> {
        return this.requestMaker(`/animes/${id}`, "GET");
    }

    /**
     * @deprecated
     * @param ids 
     * @returns 
     */
    public async getBatchAnime(ids: number[]): Promise<ShikimoriAnime[]> {
        const animeIds = ids.join(",");
        return this.requestMaker(`/animes?ids=${animeIds}&limit=50&censored=true`, "GET");
    }

    /**
     * @deprecated
     * @param page 
     * @param season 
     * @returns 
     */
    public async getSeasonAnimeByPage(page: number, season: string): Promise<ShikimoriAnime[]> {
        return this.requestMaker(`/animes?limit=50&season=${season}&page=${page}&censored=true`, "GET");
    }

    public async getBatchGraphAnime(ids: number[]): Promise<ShikimoriGraphAnimeRequest> {
        const query = getAnimeWithRelationsQuery;
        const animeIds = ids.join(",");
        return this.requestMaker(`/graphql`, "POST", false, {
            operationName: null,
            query,
            variables: {
                ids: animeIds
            }
        });
    }

    public async getBatchGraphAnimeWithouRelation(ids: number[]): Promise<ShikimoriGraphAnimeWithoutRelationRequest[]> {
        const query = getAnimeWithoutRelationQuery;
        const animeIds = ids.join(",");
        return this.requestMaker(`/graphql`, "POST", false, {
            operationName: null,
            query,
            variables: {
                ids: animeIds
            }
        });
    }

    public async getGraphAnimeBySeason(page: number, season: string): Promise<ShikimoriGraphAnimeWithoutRelationRequest> {
        const query = getAnimeBySeasonQuery;
        return this.requestMaker(`/graphql`, "POST", false, {
            operationName: null,
            query,
            variables: {
                season,
                page
            }
        });
    }
}