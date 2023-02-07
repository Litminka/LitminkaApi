import { Anime, User } from "@prisma/client";
import ShikimoriApi from "../helper/shikimoriapi";
import { ServerError, ShikimoriAnimeFull } from "../ts/index";
import { prisma } from "../db";

interface iAnimeUpdateService {
    shikimoriApi: ShikimoriApi
    user: User
}


export default class AnimeUpdateService implements iAnimeUpdateService {
    shikimoriApi: ShikimoriApi;
    user: User;
    constructor(shikimori: ShikimoriApi, user: User) {
        this.shikimoriApi = shikimori;
        this.user = user;
    }

    async update(anime: Anime): Promise<boolean> {
        const resAnime: ShikimoriAnimeFull | ServerError = await this.shikimoriApi.getAnimeById(anime.shikimori_id);
        if (resAnime.reqStatus === 500 || resAnime.reqStatus === 404) return false;
        const update = resAnime as ShikimoriAnimeFull;
        await prisma.anime.update({
            where: {
                id: anime!.id
            },
            data: {
                shikimori_score: parseFloat(update.score),
                description: update.description,
                japanese_name: update.japanese ? update.japanese[0] : null,
                franchise_name: update.franchise,
                rpa_rating: update.rating,
                genres: {
                    connectOrCreate: update.genres.map((genre) => {
                        return {
                            where: {
                                name: genre.russian
                            },
                            create: {
                                name: genre.russian
                            }
                        }
                    }),
                }
            }
        });
        return true;
    }
}
