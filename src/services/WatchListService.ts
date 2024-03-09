import BadRequestError from "../errors/clienterrors/BadRequestError";
import NotFoundError from "../errors/clienterrors/NotFoundError";
import UnauthorizedError from "../errors/clienterrors/UnauthorizedError";
import InternalServerError from "../errors/servererrors/InternalServerError";
import groupArrSplice from "../helper/groupsplice";
import AnimeList from "../models/AnimeList";
import User from "../models/User";
import { AddToList, ServerError, ShikimoriAnime, ShikimoriWatchList } from "../ts";
import { RequestStatuses } from "../ts/enums";
import AnimeUpdateService from "./AnimeUpdateService";
import KodikApiService from "./KodikApiService";
import ShikimoriApiService from "./ShikimoriApiService";
import { logger } from "../loggerConf";

export default class WatchListService {

    // TODO: A lot of not optimized loops and methods, rewrite this method
    public static async importListByUserId(id: number) {

        // Get current user
        const user = await User.findUserByIdWithIntegration(id);
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
            const anime_id = animeInList.find((anime) => anime.shikimori_id == listEntry.target_id)!.id;
            const res = await AnimeList.updateUsersWatchList(id, anime_id, listEntry);
            // if were updated, remove from array, to prevent inserting
            // prisma does not have upsert many, so we remove updated titles
            const { count } = res;
            if (count > 0) watchList.splice(i--, 1);
        }
        await AnimeList.createUsersWatchList(id, animeInList, watchList);
    }

    public static async addAnimeToListByIdWithParams(user_id: number, anime_id: number, addingParameters: AddToList) {
        const user = await User.findUserById(user_id);
        const animeListEntry = await AnimeList.findWatchListByIds(user.id, anime_id);
        if (animeListEntry) throw new BadRequestError("List entry with this anime already exists");
        await AnimeList.addAnimeToListByIds(user.id, anime_id, addingParameters)
        return await AnimeList.findWatchListByIdsWithAnime(user.id, anime_id);
    }

    public static async removeAnimeFromList(user_id: number, anime_id: number) {
        const user = await User.findUserById(user_id);
        const animeListEntry = await AnimeList.findWatchListByIds(user.id, anime_id);
        if (!animeListEntry) throw new NotFoundError("List entry with this anime doesn't exists");
        await AnimeList.removeAnimeFromListById(anime_id);
    }

    public static async editAnimeListByIdWithParams(user_id: number, anime_id: number, editParameters: AddToList) {
        const user = await User.findUserById(user_id);
        const animeListEntry = await AnimeList.findWatchListByIds(user.id, anime_id);
        if (!animeListEntry) throw new NotFoundError("List entry with this anime doesn't exists");
        await AnimeList.updateAnimeListByAnimeId(anime_id, editParameters)
        return await AnimeList.findWatchListByIdsWithAnime(user.id, anime_id);
    }
}