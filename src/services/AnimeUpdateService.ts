import { Anime, User } from "@prisma/client";
import ShikimoriApiService from "./ShikimoriApiService";
import { ServerError, ShikimoriAnimeFull, ShikimoriAnime } from "../ts/index";
import { KodikAnime, KodikAnimeFull, checkAnime, translation } from "../ts/kodik";
import { prisma } from "../db";
import { cyrillicSlug } from "../helper/cyrillic-slug";
import { RequestStatuses } from "../ts/enums";

interface iAnimeUpdateService {
    shikimoriApi: ShikimoriApiService | undefined
    user: User | undefined
}

export default class AnimeUpdateService implements iAnimeUpdateService {
    shikimoriApi: ShikimoriApiService | undefined;
    user: User | undefined;
    constructor(shikimori?: ShikimoriApiService, user?: User) {
        this.shikimoriApi = shikimori;
        this.user = user;
    }

    async update(anime: Anime): Promise<boolean> {
        if (!this.shikimoriApi) throw { error: 'No shikimori api specified' };
        const resAnime: ShikimoriAnimeFull | ServerError = await this.shikimoriApi.getAnimeById(anime.shikimori_id);
        if (!resAnime) return false;
        if (resAnime.reqStatus === RequestStatuses.InternalServerError || resAnime.reqStatus === RequestStatuses.NotFound) return false;
        const update = resAnime as ShikimoriAnimeFull;
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

    async updateAnimeShikimoriFull(animeArr: ShikimoriAnimeFull[]) {
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
                    japanese_name: anime.japanese[0] ?? "",
                    slug: `${anime.id}-${cyrillicSlug(anime.russian ? anime.russian : anime.name)}`,
                    description: anime.description,
                    franchise_name: anime.franchise,
                    genres: {
                        connectOrCreate: anime.genres!.map(name => {
                            return {
                                where: { name: name.russian },
                                create: { name: name.russian }
                            }
                        })
                    },
                    rpa_rating: anime.rating,
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
                    description: anime.description,
                    franchise_name: anime.franchise,
                    media_type: anime.kind,
                    japanese_name: anime.japanese[0] ?? "",
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
                    slug: `${anime.id}-${cyrillicSlug(anime.russian ? anime.russian : anime.name)}`,
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
                    media_type: anime.kind,
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

    async updateTranslationGroups(result: KodikAnimeFull[]) {
        const translations: Map<number, translation> = new Map();
        const groupIdsSet: Set<number> = new Set();
        for (const anime of result) {
            for (const translation of anime.translations) {
                groupIdsSet.add(translation.id);
                translations.set(translation.id, translation);
            }
        }
        const groups = await prisma.group.findMany({
            where: {
                id: {
                    in: [...groupIdsSet]
                }
            }
        })
        const inDbGroupIds = new Set(groups.map(group => group.id));
        const notInDbIds = new Set([...groupIdsSet].filter(x => !inDbGroupIds.has(x)));
        const groupInDBUpdates = [...inDbGroupIds].map(id => {
            const translation = translations.get(id);
            prisma.group.updateMany({
                where: {
                    id,
                },
                data: {
                    id: translation!.id,
                    type: translation!.type,
                    name: translation!.title
                }
            });
        })
        await prisma.group.createMany({
            data: [...notInDbIds].map(id => {
                const translation = translations.get(id);
                return {
                    id: translation!.id,
                    type: translation!.type,
                    name: translation!.title
                }
            })
        });
        await Promise.all([...groupInDBUpdates])
    }

    async updateAnimeKodik(result: KodikAnimeFull[]) {
        await this.updateTranslationGroups(result);
        const listTransaction = result.map((anime) => {
            const { material_data } = anime;
            let animeSlugTitle = material_data.anime_title;
            if (!animeSlugTitle) {
                animeSlugTitle = material_data.title_en;
            }
            const slug = `${anime.shikimori_id}-${cyrillicSlug(animeSlugTitle)}`;
            return prisma.anime.upsert({
                where: {
                    shikimori_id: parseInt(anime.shikimori_id),
                },
                create: {
                    slug,
                    current_episodes: material_data.episodes_aired,
                    max_episodes: material_data.episodes_total,
                    shikimori_id: parseInt(anime.shikimori_id),
                    english_name: material_data.title_en,
                    status: material_data.anime_status,
                    image: material_data.poster_url,
                    name: material_data.anime_title,
                    media_type: material_data.anime_kind,
                    shikimori_score: material_data.shikimori_rating,
                    first_episode_aired: new Date(material_data.aired_at),
                    kodik_link: anime.link,
                    rpa_rating: material_data.rating_mpaa,
                    description: material_data.anime_description,
                    last_episode_aired: material_data.released_at ? new Date(material_data.released_at) : null,
                    anime_translations: {
                        createMany: {
                            data: anime.translations.map(translation => {
                                return {
                                    group_id: translation.id,
                                    current_episodes: translation.episodes_count ?? 0,
                                }
                            })
                        }
                    },
                    genres: {
                        connectOrCreate: material_data.anime_genres?.map(name => {
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
                    rpa_rating: material_data.rating_mpaa,
                    kodik_link: anime.link,
                    media_type: material_data.anime_kind,
                    description: material_data.anime_description,
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

    async updateTranslations(anime: KodikAnimeFull, animeDB: checkAnime) {
        for (const translation of anime.translations) {
            const update = await prisma.anime_translation.updateMany({
                where: {
                    AND: {
                        anime_id: animeDB.id,
                        group_id: translation.id,
                    }
                },
                data: {
                    current_episodes: translation.episodes_count,
                }
            })
            if (update) continue;
            prisma.anime_translation.create({
                data: {
                    anime_id: animeDB.id,
                    group_id: translation.id,
                    current_episodes: translation.episodes_count,
                }
            });
        }
    }

    async updateGroups(result: KodikAnimeFull[]) {
        // Form unique translations from all collected data
        const translations: Map<number, translation> = new Map<number, translation>();
        for (const res of result) {
            for (const translation of res.translations) {
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
