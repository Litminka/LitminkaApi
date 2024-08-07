/* eslint-disable camelcase */
import fetch from 'node-fetch';
import {
    _KodikAnimeFullRequest,
    _KodikAnimeWithTranslationsFullRequest,
    _KodikAnimeWithTranslationsRequest,
    KodikAnimeFull,
    KodikGenresRequest,
    _KodikAnimeRequest,
    translation,
    KodikAnime,
    _translation
} from '@/ts/kodik';
import { RequestStatuses } from '@enums';
import { logger } from '@/loggerConf';
import config from '@/config';

export default class KodikApiService {
    baseurl = 'https://kodikapi.com';

    private async _requestFullAnime(shikimori_id: number): Promise<_KodikAnimeFullRequest> {
        const params = new URLSearchParams({
            token: config.kodikApiKey!,
            shikimori_id: shikimori_id.toString(),
            with_material_data: 'true'
        });
        const response = await fetch(`${this.baseurl}/search`, {
            method: 'POST',
            body: params,
            timeout: 10000
        });
        if (response.status !== RequestStatuses.OK)
            throw {
                reqStatus: RequestStatuses.InternalServerError,
                message: 'Server error'
            };
        const res = await response.json();
        res.shikimori_request = shikimori_id;
        return res;
    }

    private async _requestAnime(shikimori_id: number): Promise<_KodikAnimeRequest> {
        const params = new URLSearchParams({
            token: config.kodikApiKey!,
            shikimori_id: shikimori_id.toString()
        });
        const response = await fetch(`${this.baseurl}/search`, {
            method: 'POST',
            body: params
        });
        if (response.status !== RequestStatuses.OK)
            throw {
                reqStatus: RequestStatuses.InternalServerError,
                message: 'Server error'
            };
        return await response.json();
    }

    private _packFullAnime(request: _KodikAnimeFullRequest) {
        const { reqStatus, shikimori_request, time, total, results } = request;
        if (results.length == 0) {
            const newResult: any = request;
            newResult.result = null;
            delete newResult.results;
            return newResult as _KodikAnimeWithTranslationsFullRequest;
        }
        const translations = new Map<number, translation>();

        for (const res of results) {
            let episodes = res.episodes_count ?? 1;
            if (episodes === undefined) {
                episodes = res.material_data.episodes_aired;
            }

            const { title, type, id } = res.translation;

            const translation = translations.get(id);
            if (typeof translation !== 'undefined' && translation.episodes_count <= episodes) {
                continue;
            }

            translations.set(id, {
                episodes_count: episodes,
                link: res.link,
                title,
                type,
                id
            });
        }
        const resultObj = results[0] as any;
        resultObj.translations = [...translations.values()];
        delete resultObj.translation;
        delete resultObj.episodes_count;
        const newResult: _KodikAnimeWithTranslationsFullRequest = {
            reqStatus,
            shikimori_request,
            time,
            total,
            result: resultObj
        };
        return newResult;
    }

    private _packAnime(request: _KodikAnimeRequest) {
        const { reqStatus, time, total, results } = request;
        if (results.length == 0) {
            const newResult: any = request;
            newResult.result = null;
            delete newResult.results;
            return newResult as _KodikAnimeWithTranslationsRequest;
        }
        const translations = new Map<number, translation>();
        for (const res of results) {
            const episodes = res.episodes_count ?? 1;
            const { title, type, id } = res.translation;

            const translation = translations.get(id);
            if (typeof translation !== 'undefined' && translation.episodes_count <= episodes) {
                continue;
            }

            translations.set(id, {
                episodes_count: episodes,
                link: res.link,
                title,
                type,
                id
            });
        }
        const resultObj = results[0] as any;
        resultObj.translations = [...translations.values()];
        delete resultObj.translation;
        delete resultObj.episodes_count;
        const newResult: _KodikAnimeWithTranslationsRequest = {
            reqStatus,
            time,
            total,
            result: resultObj
        };
        return newResult;
    }

    private async _getAnimeFull(shikimori_id: number): Promise<KodikAnimeFull | undefined> {
        let response: _KodikAnimeFullRequest;
        try {
            response = await this._requestFullAnime(shikimori_id);
        } catch (error) {
            logger.error(error);
            return;
        }
        const packedAnime = this._packFullAnime(response);
        if (!packedAnime.result) return;
        return packedAnime.result;
    }

    private async _getAnime(shikimori_id: number): Promise<KodikAnime | undefined> {
        let response: _KodikAnimeRequest;
        try {
            response = await this._requestAnime(shikimori_id);
        } catch (error) {
            logger.error(error);
            return;
        }
        const packedAnime = this._packAnime(response);
        if (!packedAnime.result) return;
        return packedAnime.result;
    }

    async getGenres(): Promise<KodikGenresRequest> {
        const params = new URLSearchParams({
            token: config.kodikApiKey!,
            genres_type: 'shikimori',
            types: 'anime'
        });
        const response = await fetch(`${this.baseurl}/genres`, {
            method: 'POST',
            body: params
        });
        if (response.status !== RequestStatuses.OK)
            throw {
                reqStatus: RequestStatuses.InternalServerError,
                message: 'Server error'
            };
        return await response.json();
    }

    async getTranslationGroups(): Promise<_translation[]> {
        const params = new URLSearchParams({
            token: config.kodikApiKey!,
            genres_type: 'shikimori'
        });
        const response = await fetch(`${this.baseurl}/translations`, {
            method: 'POST',
            body: params
        });
        return await response.json();
    }

    async getFullBatchAnime(shikimoriIds: number[]): Promise<KodikAnimeFull[]> {
        const awaitResult: Promise<any>[] = [];
        for (const shikimori_id of shikimoriIds) {
            const promise = this._getAnimeFull(shikimori_id);
            awaitResult.push(promise);
        }
        let result: KodikAnimeFull[] = await Promise.all(awaitResult);
        result = result.filter((anime) => {
            return anime !== undefined;
        });
        return result;
    }

    async getBatchAnime(shikimoriIds: number[]): Promise<KodikAnime[]> {
        const awaitResult: Promise<any>[] = [];
        for (const shikimori_id of shikimoriIds) {
            const promise = this._getAnime(shikimori_id);
            awaitResult.push(promise);
        }
        let result: KodikAnimeFull[] = await Promise.all(awaitResult);
        result = result.filter((anime) => {
            return anime !== undefined;
        });
        return result;
    }

    async getFullAnime(shikimoriId: number): Promise<KodikAnimeFull | undefined> {
        const anime = await this._getAnimeFull(shikimoriId);
        return anime;
    }

    async getAnime(shikimoriId: number): Promise<KodikAnime | undefined> {
        const anime = await this._getAnime(shikimoriId);
        return anime;
    }
}
