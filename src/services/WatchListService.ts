import BadRequestError from "../errors/clienterrors/BadRequestError";
import NotFoundError from "../errors/clienterrors/NotFoundError";
import UnauthorizedError from "../errors/clienterrors/UnauthorizedError";
import InternalServerError from "../errors/servererrors/InternalServerError";
import groupArrSplice from "../helper/groupsplice";
import { AddToList, ServerError, ShikimoriAnime, ShikimoriWatchList } from "../ts";
import { RequestStatuses } from "../ts/enums";
import AnimeUpdateService from "./AnimeUpdateService";
import KodikApiService from "./KodikApiService";
import ShikimoriApiService from "./ShikimoriApiService";
import { logger } from "../loggerConf";
import prisma from "../db";
import { ShikimoriAnimeWithRelation, ShikimoriGraphAnime } from "../ts/shikimori";
import { translations } from "../ts/kodik";

export default class WatchListService {

    // TODO: A lot of not optimized loops and methods, rewrite this method
    /**
     * @deprecated
     * @param id 
     */
    public static async importListByUserId(id: number) {

        // Get current user
        const user = await prisma.user.findUserByIdWithIntegration(id);
        const shikimoriapi = new ShikimoriApiService(user);
        let animeList = await shikimoriapi.getUserList();
        logger.info("Got list");
        let watchList: ShikimoriWatchList[] = animeList as ShikimoriWatchList[];
        const shikimoriAnimeIds: number[] = watchList.map((anime) => anime.target_id);

        // Get all anime from kodik
        const kodik = new KodikApiService();
        let result = await kodik.getFullBatchAnime(shikimoriAnimeIds);

        logger.info("Got anime from kodik");

        // Isolate all results that returned nothing
        const kodikIds = result.map(anime => parseInt(anime.shikimori_id));
        const noResultIds = shikimoriAnimeIds.filter(id => kodikIds.indexOf(id) < 0);

        // Request all isolated ids from shikimori
        // Splice all ids into groups of 50, so we can batch request anime from shikimori
        const idsSpliced = groupArrSplice(noResultIds, 50);
        const shikimoriRes: Promise<any>[] = idsSpliced.flatMap(async batch => {
            return await shikimoriapi.getBatchAnime(batch);
        });
        let noResultAnime: ShikimoriAnime[] = await Promise.all(shikimoriRes.flatMap(async p => await p));
        noResultAnime = noResultAnime.flat();

        // remove all nasty stuff from watchlist, no pron for you >:)
        const allIds = new Set([...kodikIds, ...noResultAnime.map(anime => anime.id)]);
        watchList = watchList.filter(list => allIds.has(list.target_id));

        const animeUpdateService = new AnimeUpdateService(shikimoriapi, user);
        await animeUpdateService.updateGroups(result);
        let animeInList = await animeUpdateService.updateAnimeKodik(result);
        const shikimoriUpdate = await animeUpdateService.updateAnimeShikimori(noResultAnime);

        animeInList = animeInList.concat(shikimoriUpdate);
        for (let i = 0; i < watchList.length; i++) {
            const listEntry = watchList[i];
            const animeId = animeInList.find((anime) => anime.shikimoriId == listEntry.target_id)!.id;
            const res = await prisma.animeList.updateUsersWatchList(id, animeId, listEntry);
            // if were updated, remove from array, to prevent inserting
            // prisma does not have upsert many, so we remove updated titles
            const { count } = res;
            if (count > 0) watchList.splice(i--, 1);
        }
        await prisma.animeList.createUsersWatchList(id, animeInList, watchList);
    }

    public static async importListV2(id: number) {

        const user = await prisma.user.findUserByIdWithIntegration(id);
        const shikimoriApi = new ShikimoriApiService(user);
        const kodikApi = new KodikApiService();

        const watchList = await shikimoriApi.getUserList();
        logger.info(`Got list of user ID:${user.id}:${user.login}`);

        const watchListAnimeIds: number[] = watchList.map((anime) => anime.target_id);
        const groupedIds = groupArrSplice(watchListAnimeIds, 50);

        let batchNumber = 0;
        const shikimoriMap = new Map<number, ShikimoriGraphAnime>();
        const translations = new Map<number, translations>();
        const noTranslations = new Set<number>();
        for (const batch of groupedIds) {
            batchNumber++;
            logger.info(`Requesting anime from watchList, batch:${batchNumber}`);
            const shikimoriData = await shikimoriApi.getBatchGraphAnime(batch);
            for (const anime of shikimoriData.data.animes) {
                shikimoriMap.set(Number(anime.id), anime);
                for (const relation of anime.related) {
                    if (relation.anime == null) continue;
                    const id = Number(relation.anime.id);

                    if (shikimoriMap.has(id)) continue; // prefer anime with relations
                    
                    shikimoriMap.set(id, relation.anime);
                    
                    if (noTranslations.has(id)) continue;

                    noTranslations.add(id);
                }
            }
            const kodikData = await kodikApi.getBatchAnime(batch);
            for (const kodikAnime of kodikData) {
                if (kodikAnime.translations.length < 1) console.log("empty anime")
                translations.set(Number(kodikAnime.shikimori_id), kodikAnime.translations);
            }
        }
        
        batchNumber = 0;
        const translationBatch = groupArrSplice([...noTranslations], 50);
        for (const batch of translationBatch) {
            logger.info(`Requesting additional translations from kodik, batch:${batchNumber}`);
            const kodikData = await kodikApi.getBatchAnime(batch);
            for (const kodikAnime of kodikData) {
                translations.set(Number(kodikAnime.shikimori_id), kodikAnime.translations);
            }
            batchNumber++;
        }

        console.log(watchList.length,shikimoriMap.size, translations.size);
    }

    public static async addAnimeToListByIdWithParams(userId: number, animeId: number, addingParameters: AddToList) {
        const user = await prisma.user.findUserById(userId);
        const animeListEntry = await prisma.animeList.findWatchListByIds(user.id, animeId);
        if (animeListEntry) throw new BadRequestError("List entry with this anime already exists");
        await prisma.animeList.addAnimeToListByIds(user.id, animeId, addingParameters)
        return await prisma.animeList.findWatchListByIdsWithAnime(user.id, animeId);
    }

    public static async removeAnimeFromList(userId: number, animeId: number) {
        const user = await prisma.user.findUserById(userId);
        const animeListEntry = await prisma.animeList.findWatchListByIds(user.id, animeId);
        if (!animeListEntry) throw new NotFoundError("List entry with this anime doesn't exists");
        await prisma.animeList.removeAnimeFromListById(animeId);
    }

    public static async editAnimeListByIdWithParams(userId: number, animeId: number, editParameters: AddToList) {
        const user = await prisma.user.findUserById(userId);
        const animeListEntry = await prisma.animeList.findWatchListByIds(user.id, animeId);
        if (!animeListEntry) throw new NotFoundError("List entry with this anime doesn't exists");
        await prisma.animeList.updateAnimeListByAnimeId(animeId, editParameters)
        return await prisma.animeList.findWatchListByIdsWithAnime(user.id, animeId);
    }
}