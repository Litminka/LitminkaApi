import { Anime, Anime_translation } from "@prisma/client";
import { getPreviousSeasonStart, getCurrentSeasonEnd, getSeason } from "../helper/animeseason";
import groupArrSplice from "../helper/groupsplice";
import KodikApi from "../helper/kodikapi";
import ShikimoriApi from "../helper/shikimoriapi";
import { ShikimoriAnime, KodikAnimeWithTranslationsFull, followType, ServerError, KodikAnimeWithTranslationsFullRequest, checkAnime } from "../ts/index";


export default class AutoCheckService {
    constructor() {

    }

    async checkAnime(shikimoriAnime: ShikimoriAnime, kodikAnime?: KodikAnimeWithTranslationsFull, follow?: followType, anime?: checkAnime) {
        const { status } = shikimoriAnime;
        // if we have no anime in db, create it and exit
        if (typeof anime === "undefined") {
            return;
        }

        if (typeof anime !== "undefined" && typeof kodikAnime !== "undefined") {
            if (anime.status !== status) {
                console.log(`Anime ${anime.name} changed status ${anime.status} -> ${status}`)
            }
            for (const translation of anime.anime_translations) {
                const kodikTranslation = kodikAnime.translations.find(kodikTranslation => translation.group_id === kodikTranslation.id)
                if (kodikTranslation?.episodes_count !== translation.current_episodes) console.log(`NEW Episode: ${anime.name}: ${kodikTranslation?.title} ${kodikTranslation?.episodes_count}`);
            }

        }
        if (typeof follow === "undefined") return;
    }

    async getDefaultAnime(): Promise<ShikimoriAnime[]> {
        const user: undefined = undefined; // No user is required
        const shikimoriApi = new ShikimoriApi(user);
        const checkAnime: ShikimoriAnime[] = [];
        const date = new Date();
        const prevSeasonStart = getPreviousSeasonStart(date);
        const currentSeasonEnd = getCurrentSeasonEnd(date)

        const prevSeasonString = `${getSeason(prevSeasonStart)}_${prevSeasonStart.getFullYear()}`;
        const currentSeasonString = `${getSeason(currentSeasonEnd)}_${currentSeasonEnd.getFullYear()}`;
        let seasonString = prevSeasonString;
        let page = 0;
        do {
            const anime = await shikimoriApi.getSeasonAnimeByPage(page, seasonString);
            if (!anime) throw new Error("Admin account not linked");
            const error = anime as ServerError;
            if (error.reqStatus === 500) throw new Error("Shikimori 500");
            const shikimoriAnime = anime as ShikimoriAnime[];
            if ((shikimoriAnime.length == 0 || shikimoriAnime.length < 50) && seasonString != currentSeasonString) {
                seasonString = currentSeasonString
                page = 0;
                continue;
            }
            console.log(`Getting base anime from shikimori, page:${page}, season:${seasonString}`);
            checkAnime.push(...shikimoriAnime);
            if (shikimoriAnime.length == 0 || shikimoriAnime.length < 50) break
            page += 1;
        } while (true);
        return checkAnime;
    }

    async getAnime(ids: number[]) {
        const user: undefined = undefined; // No user is required
        const shikimoriApi = new ShikimoriApi(user);
        const idsSpliced = groupArrSplice(ids, 50);
        console.log("Getting anime from shikimori")
        const shikimoriRes: Promise<any>[] = idsSpliced.flatMap(async batch => {
            let response = await shikimoriApi.getBatchAnime(batch);
            if ((<ServerError>response).reqStatus === 500) throw new Error("Shikimori 500");
            return (<ShikimoriAnime[]>response);
        });
        let followedAnime: ShikimoriAnime[] = await Promise.all(shikimoriRes.flatMap(async p => await p));
        followedAnime = followedAnime.flat();
        return followedAnime;
    }

    async getKodikAnime(anime: ShikimoriAnime[]): Promise<KodikAnimeWithTranslationsFullRequest[]> {
        const kodikApi = new KodikApi();
        const animeIds: number[][] = groupArrSplice(anime.map(a => a.id), 10);
        const animeResult: KodikAnimeWithTranslationsFullRequest[] = [];
        for (const animeBatch of animeIds) {
            const kodikAnime = await kodikApi.getBatchAnime(animeBatch);
            const error = kodikAnime as ServerError;
            if (error.reqStatus == 500) throw new Error(error.message);
            animeResult.push(...kodikAnime as KodikAnimeWithTranslationsFullRequest[]);
        }
        return animeResult;
    }

}