import { Anime, User } from "@prisma/client";
import ShikimoriApi from "../helper/shikimoriapi";
import { KodikAnime, ServerError, ShikimoriAnimeFull, KodikAnimeFullRequest, ShikimoriAnime, KodikAnimeWithTranslationsFullRequest, translations, translation } from "../ts/index";
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
        if (!resAnime) return false;
        if (resAnime.reqStatus === 500 || resAnime.reqStatus === 404) return false;
        const update = resAnime as ShikimoriAnimeFull;
        console.log(resAnime);
        await prisma.anime.update({
            where: {
                id: anime.id
            },
            data: {
                shikimori_score: parseFloat(update.score),
                description: update.description,
                japanese_name: update.japanese ? update.japanese[0] : null,
                franchise_name: update.franchise,
                rpa_rating: update.rating,
                genres: {
                    connectOrCreate: update.genres.map((genre) => {
                        const { russian: name } = genre;
                        return {
                            where: { name },
                            create: { name }
                        }
                    }),
                }
            }
        });
        return true;
    }

    async updateAnimeShikimori(animeArr: ShikimoriAnime[]) {
        const shikimoriTransaction = animeArr.map((anime) => {
            return prisma.anime.upsert({
                where: {
                    shikimori_id: anime.id,
                },
                create: {
                    current_episodes: anime.episodes_aired,
                    max_episodes: anime.episodes,
                    shikimori_id: anime.id,
                    english_name: anime.name,
                    status: anime.status,
                    image: anime.image.original,
                    name: anime.russian,
                    media_type: anime.kind,
                    shikimori_score: parseFloat(anime.score),
                    first_episode_aired: new Date(anime.aired_on),
                    last_episode_aired: new Date(anime.released_on),
                },
                update: {
                    current_episodes: anime.episodes_aired,
                    max_episodes: anime.episodes,
                    status: anime.status,
                    image: anime.image.original,
                    shikimori_score: parseFloat(anime.score),
                    first_episode_aired: new Date(anime.aired_on),
                    last_episode_aired: new Date(anime.released_on),
                }
            });
        });
        // Insert shikimori anime
        const shikimoriUpdate = await prisma.$transaction(shikimoriTransaction);
        return shikimoriUpdate;
    }

    async updateAnimeKodik(result: KodikAnimeWithTranslationsFullRequest[]) {
        const listTransaction = result.map((record) => {
            const { result: anime } = record;
            const { material_data } = anime!;
            return prisma.anime.upsert({
                where: {
                    shikimori_id: parseInt(anime!.shikimori_id),
                },
                create: {
                    current_episodes: material_data.episodes_aired,
                    max_episodes: material_data.episodes_total,
                    shikimori_id: parseInt(anime!.shikimori_id),
                    english_name: material_data.title_en,
                    status: material_data.anime_status,
                    image: material_data.poster_url,
                    name: material_data.anime_title,
                    media_type: material_data.anime_kind,
                    shikimori_score: material_data.shikimori_rating,
                    first_episode_aired: new Date(material_data.aired_at),
                    kodik_link: anime!.link,
                    rpa_rating: material_data.rating_mpaa,
                    description: material_data.anime_description,
                    last_episode_aired: material_data.released_at ? new Date(material_data.released_at) : null,
                    anime_translations: {
                        createMany: {
                            data: anime!.translations.map(translation => {
                                return {
                                    group_id: translation.id,
                                    current_episodes: translation.episodes_count ?? 0
                                }
                            })
                        }
                    },
                    genres: {
                        connectOrCreate: material_data.anime_genres.map(name => {
                            return {
                                where: { name },
                                create: { name }
                            }
                        })
                    }
                },
                update: {
                    current_episodes: material_data.episodes_aired,
                    max_episodes: material_data.episodes_total,
                    status: material_data.anime_status,
                    image: material_data.poster_url,
                    shikimori_score: material_data.shikimori_rating,
                    first_episode_aired: new Date(material_data.aired_at),
                    last_episode_aired: material_data.released_at ? new Date(material_data.released_at) : null
                }
            });
        });
        // Insert kodik anime
        let animeInList = await prisma.$transaction(listTransaction);
        return animeInList;
    }

    async updateGroups(result: KodikAnimeWithTranslationsFullRequest[]) {
        // Form unique translations from all collected data
        const translations: Map<number, translation> = new Map<number, translation>();
        for (const res of result) {
            if (res.result === null) continue;
            for (const translation of res.result.translations) {
                translations.set(translation.id, translation);
            }

        }
        const translationsArr = Array.from(translations.values());
        // Insert all unique translations
        return await prisma.$transaction(
            translationsArr.map(translation => {
                const { id, title: name, type } = translation;
                return prisma.group.upsert({
                    where: { id },
                    create: { id, name, type },
                    update: { name }
                });
            })
        );
    }
}
