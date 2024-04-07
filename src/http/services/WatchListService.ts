import BadRequestError from "@errors/clienterrors/BadRequestError";
import NotFoundError from "@errors/clienterrors/NotFoundError";
import groupArrSplice from "@/helper/groupsplice";
import { AddToList, ListFilters, ShikimoriAnime, ShikimoriWatchList, UserWithIntegration, UserWithIntegrationSettings } from "@/ts";
import AnimeUpdateService from "@services/anime/AnimeUpdateService";
import KodikApiService from "@services/KodikApiService";
import ShikimoriApiService from "@services/shikimori/ShikimoriApiService";
import { ShikimoriAnimeOptionalRelation, ShikimoriAnimeWithRelation } from "@/ts/shikimori";
import { KodikAnime } from "@/ts/kodik";
import { logger } from "@/loggerConf";
import prisma from "@/db";
import { User, Anime } from "@prisma/client";
import { importWatchListQueue } from "@/queues/queues"
import ShikimoriListSyncService from "./shikimori/ShikimoriListSyncService";

export default class WatchListService {

    /**
     * @deprecated prefer using importListV2
     * @param id 
     */
    public static async importListByUser(id: number) {

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
        let animeInList = await animeUpdateService.updateAnimeKodik(result);
        const shikimoriUpdate = await animeUpdateService.updateAnimeShikimori(noResultAnime);

        animeInList = animeInList.concat(shikimoriUpdate);
        for (let i = 0; i < watchList.length; i++) {
            const listEntry = watchList[i];
            const animeId = animeInList.find((anime) => anime.shikimoriId == listEntry.target_id)!.id;
            const res = await prisma.animeList.updateUsersWatchList(user.id, animeId, listEntry);
            // if were updated, remove from array, to prevent inserting
            // prisma does not have upsert many, so we remove updated titles
            const { count } = res;
            if (count > 0) watchList.splice(i--, 1);
        }
        await prisma.animeList.createUserWatchList(user.id, animeInList, watchList);
    }

    public static startImport(user: UserWithIntegration) {
        if (!user.integration || !user.integration.shikimoriId) throw new BadRequestError("no_shikimori_integration");

        importWatchListQueue.add("importWatchList", { id: user.id }, {
            removeOnComplete: 10,
            removeOnFail: 100
        })
    }

    public static async importListV2(id: number) {

        const user = await prisma.user.findUserByIdWithIntegration(id);
        const shikimoriApi = new ShikimoriApiService(user);
        const kodikApi = new KodikApiService();

        const watchList = await shikimoriApi.getUserList();
        logger.info(`Got list of user ID:${user.id}:${user.login}`);

        const watchListAnimeIds: number[] = watchList.map((anime) => anime.target_id);
        const groupedIds = groupArrSplice(watchListAnimeIds, 50);

        let batchNumber = 1;
        const shikimoriMap = new Map<number, ShikimoriAnimeOptionalRelation>();
        const kodikMap = new Map<number, KodikAnime>();
        const noKodikSet = new Set<number>();

        for (const batch of groupedIds) {
            logger.info(`Requesting anime from watchList, batch:${batchNumber}`);
            const shikimoriData = await shikimoriApi.getBatchGraphAnime(batch);

            for (const anime of shikimoriData.data.animes) {
                shikimoriMap.set(Number(anime.id), anime);

                anime.related = anime.related.filter(relation => relation.anime !== null)

                for (const relation of anime.related) {
                    const id = Number(relation.anime!.id);

                    if (shikimoriMap.has(id)) continue; // prefer anime with relations

                    shikimoriMap.set(id, relation.anime!);

                    noKodikSet.add(id);
                }
            }
            const kodikData = await kodikApi.getBatchAnime(batch);

            for (const kodikAnime of kodikData) {
                kodikMap.set(Number(kodikAnime.shikimori_id), kodikAnime);
            }

            batchNumber++;
        }

        batchNumber = 0;

        const translationBatch = groupArrSplice([...noKodikSet], 50);
        for (const batch of translationBatch) {
            logger.info(`Requesting additional anime from kodik, batch:${batchNumber}`);
            const kodikData = await kodikApi.getBatchAnime(batch);

            for (const kodikAnime of kodikData) {
                kodikMap.set(Number(kodikAnime.shikimori_id), kodikAnime);
            }

            batchNumber++;
        }

        const shikimoriBatchIds: number[][] = groupArrSplice([...shikimoriMap.keys()], 100);
        const writeRelations = new Map<number, ShikimoriAnimeWithRelation>();
        const shikimoriDBAnimeMap = new Map<number, number>();
        for (const batch of shikimoriBatchIds) {

            const animeBatch = await prisma.anime.getBatchAnimeShikimori(batch);
            const animeMap = new Map<number, Anime>();
            for (const anime of animeBatch) {
                animeMap.set(anime.shikimoriId, anime);
            }

            for (const id of batch) {
                const shikimoriAnime = shikimoriMap.get(id);
                const kodikAnime = kodikMap.get(id);
                const anime = animeMap.get(id);

                if (anime !== undefined) {

                    if (!anime.hasRelation &&
                        shikimoriAnime!.related !== undefined
                        && shikimoriAnime!.related.length > 0) {
                        writeRelations.set(id, shikimoriAnime! as ShikimoriAnimeWithRelation);
                    }

                    let hasRelation = false;
                    if (shikimoriAnime!.related?.length) {
                        hasRelation = true;
                    }
                    await prisma.anime.updateFromShikimoriGraph(shikimoriAnime!, hasRelation, anime, kodikAnime);
                    shikimoriDBAnimeMap.set(Number(shikimoriAnime!.id), anime.id)
                    continue;
                }

                const related = shikimoriAnime?.related;
                let hasRelation = false;
                if (related && related.length > 0) {
                    hasRelation = true;
                }
                const newAnime = await prisma.anime.createFromShikimoriGraph(shikimoriAnime!, hasRelation, kodikAnime);
                shikimoriDBAnimeMap.set(Number(shikimoriAnime!.id), newAnime.id)
                if (hasRelation) writeRelations.set(id, shikimoriAnime! as ShikimoriAnimeWithRelation);
            }
        }
        await prisma.animeRelation.createFromShikimoriMap(writeRelations);
        await prisma.animeList.createUserWatchListByMap(user.id, shikimoriDBAnimeMap, watchList);
    }

    public static async addAnimeToListWithParams(user: UserWithIntegrationSettings, animeId: number, addingParameters: AddToList) {
        const animeListEntry = await prisma.animeList.findWatchListByIds(user.id, animeId);
        const { shikimoriId } = await prisma.anime.findFirstOrThrow({
            where: {
                id: animeId
            },
            select: {
                shikimoriId: true
            }
        })

        if (animeListEntry) throw new BadRequestError("List entry with this anime already exists");

        await prisma.animeList.addAnimeToListByIds(user.id, animeId, addingParameters);

        ShikimoriListSyncService.createAddUpdateJob(user, {
            animeId: shikimoriId,
            episodes: addingParameters.watchedEpisodes,
            status: addingParameters.status,
            score: addingParameters.rating === 0 ? undefined : addingParameters.rating,
        });

        return await prisma.animeList.findWatchListByIdsWithAnime(user.id, animeId);
    }

    public static async removeAnimeFromList(user: UserWithIntegrationSettings, animeId: number) {
        const animeListEntry = await prisma.animeList.findWatchListByIds(user.id, animeId);

        if (!animeListEntry) throw new NotFoundError("List entry with this anime doesn't exists");

        if (animeListEntry.shikimoriId !== null ) {
            ShikimoriListSyncService.createDeleteJob(user, animeListEntry.shikimoriId);
        }

        await prisma.animeList.removeAnimeFromListById(animeId);
    }

    public static async editAnimeListWithParams(user: UserWithIntegrationSettings, animeId: number, editParameters: AddToList) {
        const animeListEntry = await prisma.animeList.findWatchListByIds(user.id, animeId);
        const { shikimoriId } = await prisma.anime.findFirstOrThrow({
            where: {
                id: animeId
            },
            select: {
                shikimoriId: true
            }
        })

        if (!animeListEntry) throw new NotFoundError("List entry with this anime doesn't exists");

        await prisma.animeList.updateAnimeListByAnimeId(animeId, editParameters)

        ShikimoriListSyncService.createAddUpdateJob(user, {
            animeId: shikimoriId,
            episodes: editParameters.watchedEpisodes,
            status: editParameters.status,
            score: editParameters.rating === 0 ? undefined : editParameters.rating,
        });

        return await prisma.animeList.findWatchListByIdsWithAnime(user.id, animeId);
    }

    public static async getFilteredWatchList(user: User, filters: ListFilters) {
        return await prisma.animeList.findFilteredWatchList(user.id, filters, 0);
    }
}