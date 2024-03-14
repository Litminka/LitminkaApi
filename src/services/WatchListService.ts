import BadRequestError from "../errors/clienterrors/BadRequestError";
import NotFoundError from "../errors/clienterrors/NotFoundError";
import UnauthorizedError from "../errors/clienterrors/UnauthorizedError";
import InternalServerError from "../errors/servererrors/InternalServerError";
import groupArrSplice from "../helper/groupsplice";
import { AddToList, ServerError, ShikimoriAnime, ShikimoriWatchList, UserWithIntegration } from "../ts";
import { RequestStatuses } from "../ts/enums";
import AnimeUpdateService from "./anime/AnimeUpdateService";
import KodikApiService from "./KodikApiService";
import ShikimoriApiService from "./shikimori/ShikimoriApiService";
import { logger } from "../loggerConf";
import prisma from "../db";
import { User } from "@prisma/client";

export default class WatchListService {

    // TODO: A lot of not optimized loops and methods, rewrite this method
    public static async importListByUser(user: UserWithIntegration) {

        // Get current user
        const shikimoriapi = new ShikimoriApiService(user);
        let animeList = await shikimoriapi.getUserList();
        if (!animeList) throw new UnauthorizedError("User does not have shikimori integration")
        if ((<ServerError>animeList).reqStatus === RequestStatuses.InternalServerError) throw new InternalServerError();
        logger.info("Got list");
        const watchList: ShikimoriWatchList[] = animeList as ShikimoriWatchList[];
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
            let response = await shikimoriapi.getBatchAnime(batch);
            if ((<ServerError>response).reqStatus === RequestStatuses.InternalServerError) throw new InternalServerError();
            return (<ShikimoriAnime[]>response);
        });
        let noResultAnime: ShikimoriAnime[] = await Promise.all(shikimoriRes.flatMap(async p => await p));
        noResultAnime = noResultAnime.flat();

        const animeUpdateService = new AnimeUpdateService(shikimoriapi, user);
        await animeUpdateService.updateGroups(result);
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
        await prisma.animeList.createUsersWatchList(user.id, animeInList, watchList);
    }

    public static async addAnimeToListWithParams(user: User, animeId: number, addingParameters: AddToList) {
        const animeListEntry = await prisma.animeList.findWatchListByIds(user.id, animeId);
        if (animeListEntry) throw new BadRequestError("List entry with this anime already exists");
        await prisma.animeList.addAnimeToListByIds(user.id, animeId, addingParameters)
        return await prisma.animeList.findWatchListByIdsWithAnime(user.id, animeId);
    }

    public static async removeAnimeFromList(user: User, animeId: number) {
        const animeListEntry = await prisma.animeList.findWatchListByIds(user.id, animeId);
        if (!animeListEntry) throw new NotFoundError("List entry with this anime doesn't exists");
        await prisma.animeList.removeAnimeFromListById(animeId);
    }

    public static async editAnimeListWithParams(user: User, animeId: number, editParameters: AddToList) {
        const animeListEntry = await prisma.animeList.findWatchListByIds(user.id, animeId);
        if (!animeListEntry) throw new NotFoundError("List entry with this anime doesn't exists");
        await prisma.animeList.updateAnimeListByAnimeId(animeId, editParameters)
        return await prisma.animeList.findWatchListByIdsWithAnime(user.id, animeId);
    }
}