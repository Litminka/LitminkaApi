import { Anime, Prisma, User } from "@prisma/client";
import ShikimoriApiService from "../shikimori/ShikimoriApiService";
import { ServerError, ShikimoriAnimeFull, ShikimoriAnime } from "../../ts/index";
import { KodikAnime, KodikAnimeFull, animeWithTranslation, translation } from "../../ts/kodik";
import prisma from "../../db";
import { RequestStatuses } from "../../ts/enums";
import InternalServerError from "../../errors/servererrors/InternalServerError";
import { cyrillicSlug } from "../../helper/cyrillic-slug";
import { ShikimoriGraphAnime } from "../../ts/shikimori";

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

    /**
     * @deprecated
     * @param anime 
     * @returns 
     */
    async update(anime: Anime): Promise<boolean> {
        if (!this.shikimoriApi) throw new InternalServerError("No shikimori api specified");
        const resAnime: ShikimoriAnimeFull | ServerError = await this.shikimoriApi.getAnimeById(anime.shikimoriId);
        if (!resAnime) return false;
        if (resAnime.reqStatus === RequestStatuses.InternalServerError || resAnime.reqStatus === RequestStatuses.NotFound) return false;
        const update = resAnime as ShikimoriAnimeFull;
        prisma.anime.updateShikimori(anime.id, update);
        return true;
    }

    /**
     * @deprecated
     * @param animeArr 
     * @returns 
     */
    async updateAnimeShikimoriFull(animeArr: ShikimoriAnimeFull[]) {
        return prisma.anime.upsertManyShikimoriFull(animeArr);
    }

    async createShikimoriGraphAnime(shikimoriAnime: ShikimoriGraphAnime, kodikAnime?: KodikAnime) {
        return prisma.anime.createFromShikimoriGraph(shikimoriAnime, false, kodikAnime);
    }

    async updateShikimoriGraphAnime(shikimoriAnime: ShikimoriGraphAnime, dbAnime: Anime, kodikAnime?: KodikAnime) {
        return prisma.anime.updateFromShikimoriGraph(shikimoriAnime, false, dbAnime, kodikAnime)
    }

    /**
     * @deprecated
     * @param animeArr 
     * @returns 
     */
    async updateAnimeShikimori(animeArr: ShikimoriAnime[]) {
        return prisma.anime.upsertMany(animeArr);
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
                where: { id },
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

    /**
     * @deprecated try not to update anime through kodik, if possible
     * @param result 
     * @returns 
     */
    async updateAnimeKodik(result: KodikAnimeFull[]) {
        const listTransaction = result.map((anime) => {
            const { material_data } = anime;
            let animeSlugTitle = material_data.anime_title;
            if (!animeSlugTitle) {
                animeSlugTitle = material_data.title_en;
            }
            const slug = `${anime.shikimori_id}-${cyrillicSlug(animeSlugTitle)}`;
            return prisma.anime.upsert({
                where: {
                    shikimoriId: parseInt(anime.shikimori_id),
                },
                create: {
                    slug,
                    currentEpisodes: material_data.episodes_aired,
                    maxEpisodes: material_data.episodes_total,
                    shikimoriId: parseInt(anime.shikimori_id),
                    englishName: material_data.title_en,
                    status: material_data.anime_status,
                    image: material_data.poster_url,
                    name: material_data.anime_title,
                    mediaType: material_data.anime_kind,
                    shikimoriScore: material_data.shikimori_rating,
                    firstEpisodeAired: new Date(material_data.aired_at),
                    kodikLink: anime.link,
                    rpaRating: material_data.rating_mpaa,
                    description: material_data.anime_description,
                    lastEpisodeAired: material_data.released_at ? new Date(material_data.released_at) : null,
                    animeTranslations: {
                        createMany: {
                            data: anime.translations.map(translation => {
                                return {
                                    groupId: translation.id,
                                    currentEpisodes: translation.episodes_count ?? 0,
                                } satisfies Prisma.AnimeTranslationCreateManyAnimeInput
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
                    currentEpisodes: material_data.episodes_aired,
                    maxEpisodes: material_data.episodes_total,
                    status: material_data.anime_status,
                    rpaRating: material_data.rating_mpaa,
                    kodikLink: anime.link,
                    mediaType: material_data.anime_kind,
                    description: material_data.anime_description,
                    image: material_data.poster_url,
                    shikimoriScore: material_data.shikimori_rating,
                    firstEpisodeAired: new Date(material_data.aired_at),
                    lastEpisodeAired: material_data.released_at ? new Date(material_data.released_at) : null
                }
            });
        });
        // Insert kodik anime
        let animeInList = await prisma.$transaction(listTransaction);
        return animeInList;
    }

    async updateTranslations(anime: KodikAnimeFull, animeDB: animeWithTranslation) {
        for (const translation of anime.translations) {
            const update = await prisma.animeTranslation.updateMany({
                where: {
                    AND: {
                        animeId: animeDB.id,
                        groupId: translation.id,
                    }
                },
                data: {
                    currentEpisodes: translation.episodes_count,
                }
            })
            if (update.count) continue;
            await prisma.animeTranslation.create({
                data: {
                    animeId: animeDB.id,
                    groupId: translation.id,
                    currentEpisodes: translation.episodes_count,
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
