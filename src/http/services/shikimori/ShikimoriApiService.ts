/* eslint-disable camelcase */
import { Prisma } from '@prisma/client';
import axios, { AxiosHeaders } from 'axios';
import BadRequestError from '@/errors/clienterrors/BadRequestError';
import {
    ShikimoriGraphAnimeRequest,
    ShikimoriGraphAnimeWithoutRelationRequest,
    ShikimoriGraphGenresRequest,
    ShikimoriListResponse,
    shikimoriList
} from '@/ts/shikimori';
import {
    getAnimeByPageQuery,
    getAnimeBySeasonQuery,
    getAnimeByStatusPageQuery,
    getAnimeWithRelationsQuery,
    getAnimeWithoutRelationQuery,
    getGenresQuery
} from '@/ts/shikimoriGraphQLRequests';
import {
    ShikimoriProfile,
    ShikimoriWatchList,
    ShikimoriAnime,
    ShikimoriAnimeFull
} from '@/ts/shikimori';
import prisma from '@/db';
import { shikiRateLimiter } from '@/shikiRateLimiter';
import { RateLimiter } from 'limiter';
import { RequestStatuses } from '@enums';
import ForbiddenError from '@/errors/clienterrors/ForbiddenError';
import { UserWithIntegration } from '@/ts/user';
import config from '@/config';

type RequestTypes = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
interface iShikimoriApi {
    user: UserWithIntegration | undefined;
    limiter: RateLimiter;
}

axios.defaults.validateStatus = (status) => {
    return (status >= 400 && status <= 499) || (status >= 200 && status <= 299);
};

interface ShikimoriResponse {
    access_token: string;
    refresh_token: string;
}

/**
 *  Documenting this api for the unfortunate soul that will maintain it in the future
 *  To be absolutely honest, shikimori's api is an absolute mess
 *  It is extremely bad documented, some things are not apparent so i will try to write them here
 *  Used docs:
 *      Api v2: https://shikimori.one/api/doc/2.0 for user list (called user_rates)
 *      Api v1: https://shikimori.one/api/doc/1.0 was used for anime, now is deprecated
 *      GraphQL https://shikimori.one/api/doc/graphql while experimental allows for more dynamic anime fetching,
 *                                                    also has a lot of undocumented errors
 */

const baseUrl = `${config.shikimoriUrl}/api`;
export default class ShikimoriApiService implements iShikimoriApi {
    user: UserWithIntegration | undefined;
    limiter: RateLimiter;

    constructor(user: UserWithIntegration | undefined = undefined) {
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
                    token: true
                }
            });
        }
        const requestBody = new URLSearchParams({
            grant_type: token ? 'authorization_code' : 'refresh_token',
            client_id: config.shikimoriClientId!,
            client_secret: config.shikimoriClientSecret!
        });
        // If token exists, then we assume user has just linked shikimori
        if (token) {
            requestBody.append('code', this.user.integration!.shikimoriCode!);
            requestBody.append(
                'redirect_uri',
                `${config.appUrl}/shikimori/link?token=${token!.token}`
            );
        } else {
            requestBody.append('refresh_token', this.user.integration!.shikimoriRefreshToken!);
        }
        const response = await axios(`${config.shikimoriUrl}/oauth/token`, {
            method: 'POST',
            headers: {
                'User-Agent': config.shikimoriAgent!,
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
            await prisma.integration.clearShikimoriIntegration(this.user.id);
            return false;
        }
        const data: ShikimoriResponse = await response.data;
        const integrationBody = {
            shikimoriToken: data.access_token,
            shikimoriRefreshToken: token ? data.refresh_token : undefined
        } satisfies Prisma.IntegrationUpdateInput;
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
    private async makeRequest(url: string, method: RequestTypes, auth = false, data?: unknown) {
        if (auth) {
            if (!this.user) throw new BadRequestError('no_shikimori_integration');
            if (this.user.integration === null || this.user.integration.shikimoriCode === null)
                throw new BadRequestError('no_shikimori_integration');
            if (this.user.integration.shikimoriToken === null) {
                const result = await this.getToken();
                if (result === false) throw new BadRequestError('no_shikimori_integration');
            }
        }

        let requestStatus: number = RequestStatuses.OK;
        do {
            await this.limiter.removeTokens(1);
            if (requestStatus === RequestStatuses.Unauthorized && auth) {
                const result = await this.getToken();
                if (!result) throw new BadRequestError('no_shikimori_integration');
            }

            const headers = new AxiosHeaders();

            headers.set('User-Agent', config.shikimoriAgent!);
            headers.set('Content-Type', 'application/json');

            if (auth)
                headers.set('Authorization', `Bearer ${this.user!.integration!.shikimoriToken}`);

            const response = await axios(`${baseUrl}${url}`, {
                method: method,
                data,
                headers: headers
            });

            const { status }: { status: number } = response;

            if (status !== RequestStatuses.TooManyRequests) {
                if (status === RequestStatuses.Forbidden) {
                    throw new BadRequestError('no_shikimori_rights');
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const data: any = response.data;
                if (status !== RequestStatuses.Unauthorized) return data;
            }

            requestStatus = status;
        } while (
            requestStatus === RequestStatuses.Unauthorized ||
            requestStatus === RequestStatuses.TooManyRequests
        );
    }

    private async makeListRequest(
        uri: string,
        method: RequestTypes,
        data: object
    ): Promise<unknown> {
        if (!this.user?.integration?.shikimoriCanChangeList)
            throw new BadRequestError('shikimori_cant_change_list');
        try {
            return await this.makeRequest(uri, method, true, {
                user_rate: data
            });
        } catch (error) {
            if (error instanceof ForbiddenError) {
                await prisma.user.disableShikimoriListUpdate(this.user.id);
            }
            throw error;
        }
    }

    public async getProfile(): Promise<ShikimoriProfile> {
        return this.makeRequest('/users/whoami', 'GET', true);
    }

    public async getUserList(): Promise<ShikimoriWatchList[]> {
        if (!this.user) throw new BadRequestError('no_shikimori_integration');
        if (this.user.integration!.shikimoriId === null)
            throw new BadRequestError('no_shikimori_integration');
        return this.makeRequest(
            `/v2/user_rates?user_id=${this.user.integration!.shikimoriId}&target_type=Anime&censored=true`,
            'GET'
        );
    }

    /**
     * @deprecated
     * @param id
     * @returns
     */
    public async getAnimeById(id: number): Promise<ShikimoriAnimeFull> {
        return this.makeRequest(`/animes/${id}`, 'GET');
    }

    /**
     * @deprecated
     * @param ids
     * @returns
     */
    public async getBatchAnime(ids: number[]): Promise<ShikimoriAnime[]> {
        const animeIds = ids.join(',');
        return this.makeRequest(`/animes?ids=${animeIds}&limit=50&censored=true`, 'GET');
    }

    /**
     * @deprecated
     * @param page
     * @param season
     * @returns
     */
    public async getSeasonAnimeByPage(page: number, season: string): Promise<ShikimoriAnime[]> {
        return this.makeRequest(
            `/animes?limit=50&season=${season}&page=${page}&censored=true`,
            'GET'
        );
    }

    /**
     * Get 50 anime by ids with relations
     * @param page
     * @returns ShikimoriGraphAnimeRequest
     */
    public async getBatchGraphAnime(ids: number[]): Promise<ShikimoriGraphAnimeRequest> {
        if (ids.length == 0)
            return {
                data: {
                    animes: []
                }
            };
        const query = getAnimeWithRelationsQuery;
        const animeIds = ids.join(',');
        return this.makeRequest(`/graphql`, 'POST', false, {
            operationName: null,
            query,
            variables: {
                ids: animeIds // if empty will give a random set of 50
            }
        });
    }

    /**
     * Get 50 anime by ids
     * @param page
     * @returns ShikimoriGraphAnimeWithoutRelationRequest
     */
    public async getBatchGraphAnimeWithoutRelation(
        ids: number[]
    ): Promise<ShikimoriGraphAnimeWithoutRelationRequest> {
        if (ids.length == 0)
            return {
                data: {
                    animes: []
                }
            };
        const query = getAnimeWithoutRelationQuery;
        const animeIds = ids.join(',');
        return this.makeRequest(`/graphql`, 'POST', false, {
            operationName: null,
            query,
            variables: {
                ids: animeIds // if empty will give a random set of 50
            }
        });
    }

    /**
     * Get 50 anime by page and season
     * Note: if page is less than 1, it will be set to 1
     * @param page number of page
     * @param season season in format 'season_year'
     * @returns ShikimoriGraphAnimeWithoutRelationRequest
     */
    public async getGraphAnimeBySeason(
        page: number,
        season: string
    ): Promise<ShikimoriGraphAnimeWithoutRelationRequest> {
        if (page < 1) page = 1;
        const query = getAnimeBySeasonQuery;
        return this.makeRequest(`/graphql`, 'POST', false, {
            operationName: null,
            query,
            variables: {
                season,
                page // must be larger than zero or shikimori will throw 503 error
            }
        });
    }

    /**
     * Get 50 anime by shikimori page
     * Note: if page is less than 1, it will be set to 1
     * @param page
     * @returns ShikimoriGraphAnimeWithoutRelationRequest
     */
    public async getGraphAnnouncesByPage(
        page: number
    ): Promise<ShikimoriGraphAnimeWithoutRelationRequest> {
        if (page < 1) page = 1;
        const query = getAnimeByStatusPageQuery;
        return this.makeRequest(`/graphql`, 'POST', false, {
            operationName: null,
            query,
            variables: {
                status: 'anons',
                page // must be larger than zero or shikimori will throw 503 error
            }
        });
    }

    /**
     * Get 50 anime by shikimori page
     * Note: if page is less than 1, it will be set to 1
     * @param page
     * @returns ShikimoriGraphAnimeWithoutRelationRequest
     */
    public async getGraphAnimeByPage(
        page: number
    ): Promise<ShikimoriGraphAnimeWithoutRelationRequest> {
        if (page < 1) page = 1;
        const query = getAnimeByPageQuery;
        return this.makeRequest(`/graphql`, 'POST', false, {
            operationName: null,
            query,
            variables: {
                page // must be larger than zero or shikimori will throw 503 error
            }
        });
    }

    /**
     * Get all shikimori genres
     * @returns ShikimoriGraphGenresRequest
     */
    public async getGraphGenres(): Promise<ShikimoriGraphGenresRequest> {
        const query = getGenresQuery;
        return this.makeRequest(`/graphql`, 'POST', false, {
            operationName: null,
            query
        });
    }

    /**
     * Updates or adds an entry of animeList to shikimori
     * Requires auth to function
     * @param userList
     * @throws BadRequestError
     * @throws ForbiddenError
     * @returns ShikimoriGraphAnimeWithoutRelationRequest
     */
    public async addOrUpdateList(userList: shikimoriList): Promise<ShikimoriListResponse> {
        /**
         * So about this implementation, shikimori's api specifically states,
         * You have 2 ways of updating a record and a one way to add it
         * That's not the case, the documentation does not tell the whole picture
         * So the POST method also updates records, the only difference is query param of rate
         * So we are gonna use this feature, hoping it won't be deleted
         */

        const { episodes, status, animeId, score } = userList;
        const requestData = {
            episodes,
            status,
            score,
            target_id: animeId,
            user_id: this.user!.integration!.shikimoriId,
            target_type: 'Anime'
        };

        return (await this.makeListRequest(
            '/v2/user_rates',
            'POST',
            requestData
        )) as ShikimoriListResponse;
    }

    /**
     * Updates or adds an entry of animeList to shikimori
     * Requires auth to function
     * @param id of listEntryOnShikimori
     * @throws BadRequestError
     * @throws ForbiddenError
     */
    public async deleteListEntry(id: number): Promise<void> {
        await this.makeListRequest(`/v2/user_rates/${id}`, 'DELETE', {});
    }
}
