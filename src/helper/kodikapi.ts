import fetch, { Headers } from "node-fetch";
import { KodikAnimeFullRequest, KodikAnimeRequest, KodikAnimeWithTranslationsFullRequest, KodikGenresRequest, ServerError, translations } from "../ts/index";

export default class KodikApi {
    baseurl = "https://kodikapi.com"

    async getAnime(shikimori_id: number): Promise<KodikAnimeRequest | ServerError> {
        const params = new URLSearchParams({
            "token": process.env.kodik_api_key!,
            "shikimori_id": shikimori_id.toString(),
        });

        const response = await fetch(`${this.baseurl}/search`, {
            method: "POST",
            body: params
        })
        if (response.status !== 200) return { reqStatus: 500, message: "Server error" };
        return await response.json();
    }

    async getBatchAnime(shikimoriIds: number[]): Promise<KodikAnimeWithTranslationsFullRequest[] | ServerError> {
        let error = false;
        const awaitResult: Promise<any>[] = shikimoriIds.flatMap(async shikimori_id => {
            if (error) return;
            let response = await this.getFullAnime(shikimori_id);
            if ((<ServerError>response).reqStatus === 500) {
                error = true;
                return;
            };
            const requestResult = response as KodikAnimeFullRequest;
            if (!requestResult) return requestResult;
            const { reqStatus, shikimori_request, time, total, results } = requestResult
            if (results.length == 0) {
                const newResult: any = response;
                newResult.result = null;
                delete newResult.results;
                return newResult as KodikAnimeWithTranslationsFullRequest;
            };
            const translations: translations = []
            for (const res of results) {
                let episodes = res.episodes_count;
                if (typeof episodes === "undefined") {
                    episodes = res.material_data.episodes_aired;
                }
                translations.push({
                    episodes_count: episodes,
                    ...res.translation
                });
            }
            const resultObj = results[0] as any;
            resultObj.translations = translations;
            delete resultObj.translation;
            delete resultObj.episodes_count;
            const newResult: KodikAnimeWithTranslationsFullRequest = {
                reqStatus, shikimori_request, time, total,
                result: resultObj
            }
            return newResult;
        });
        let result: KodikAnimeWithTranslationsFullRequest[] = await Promise.all(awaitResult.flatMap(async p => await p));
        if (error) return { reqStatus: 500, message: "Server error" };
        return result;
    }

    async getFullAnime(shikimori_id: number): Promise<KodikAnimeFullRequest | ServerError> {
        const params = new URLSearchParams({
            "token": process.env.kodik_api_key!,
            "shikimori_id": shikimori_id.toString(),
            "with_material_data": "true"
        });
        const response = await fetch(`${this.baseurl}/search`, {
            method: "POST",
            body: params,
            timeout: 10000
        })
        if (response.status !== 200) return { reqStatus: 500, message: "Server error" };
        const res = await response.json();
        res.shikimori_request = shikimori_id;
        return res;
    }

    async getGenres(): Promise<KodikGenresRequest | ServerError> {
        const params = new URLSearchParams({
            "token": process.env.kodik_api_key!,
            "genres_type": "shikimori",
        });
        const response = await fetch(`${this.baseurl}/genres`, {
            method: "POST",
            body: params
        })
        if (response.status !== 200) return { reqStatus: 500, message: "Server error" };
        return await response.json();
    }
}