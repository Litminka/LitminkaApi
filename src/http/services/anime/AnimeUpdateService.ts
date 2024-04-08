import { Anime, Prisma, User } from "@prisma/client";
import ShikimoriApiService from "@services/shikimori/ShikimoriApiService";
import { ShikimoriAnimeFull, ShikimoriAnime } from "@/ts/index";
import { KodikAnime, KodikAnimeFull, animeWithTranslation, _translation } from "@/ts/kodik";
import prisma from "@/db";
import InternalServerError from "@errors/servererrors/InternalServerError";
import { cyrillicSlug } from "@/helper/cyrillic-slug";
import { ShikimoriAnimeWithRelation, ShikimoriGraphAnime, ShikimoriRelation } from "@/ts/shikimori";
import { config } from "@/config";
import groupArrSplice from "@/helper/groupsplice";
import sleep from "@/helper/sleep";
import { logger } from "@/loggerConf";
import KodikApiService from "@services/KodikApiService";

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
        const resAnime: ShikimoriAnimeFull = await this.shikimoriApi.getAnimeById(anime.shikimoriId);
        if (!resAnime) return false;
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
        if (typeof kodikAnime !== "undefined") {
            await this.updateTranslationGroups([kodikAnime]);
        }
        return await prisma.anime.createFromShikimoriGraph(shikimoriAnime, false, kodikAnime);
    }

    async updateShikimoriGraphAnime(shikimoriAnime: ShikimoriGraphAnime, dbAnime: Anime, kodikAnime?: KodikAnime) {
        if (typeof kodikAnime !== "undefined") {
            await this.updateTranslationGroups([kodikAnime]);
        }
        return await prisma.anime.updateFromShikimoriGraph(shikimoriAnime, false, dbAnime, kodikAnime);
    }

    /**
     * @deprecated
     * @param animeArr 
     * @returns 
     */
    async updateAnimeShikimori(animeArr: ShikimoriAnime[]) {
        return prisma.anime.upsertMany(animeArr);
    }

    async updateTranslationGroups(result: KodikAnimeFull[] | KodikAnime[]) {
        const translations: Map<number, _translation> = new Map();
        for (const anime of result) {
            for (const translation of anime.translations) {
                translations.set(translation.id, translation);
            }
        }
        for (const translation of translations.values()) {
            await prisma.group.upsert({
                where: {
                    id: translation.id
                },
                create: {
                    id: translation.id,
                    type: translation.type,
                    name: translation.title
                },
                update: {
                    id: translation.id,
                    type: translation.type,
                    name: translation.title
                }
            });

        }
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
                    shikimoriRating: material_data.shikimori_rating,
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
                                    link: translation.link
                                } satisfies Prisma.AnimeTranslationCreateManyAnimeInput;
                            })
                        }
                    },
                    genres: {
                        connectOrCreate: material_data.anime_genres?.map(name => {
                            return {
                                where: { name },
                                create: { name }
                            };
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
                    shikimoriRating: material_data.shikimori_rating,
                    firstEpisodeAired: new Date(material_data.aired_at),
                    lastEpisodeAired: material_data.released_at ? new Date(material_data.released_at) : null
                }
            });
        });
        // Insert kodik anime
        const animeInList = await prisma.$transaction(listTransaction);
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
            });
            if (update.count) continue;
            await prisma.animeTranslation.create({
                data: {
                    link: translation.link,
                    animeId: animeDB.id,
                    groupId: translation.id,
                    currentEpisodes: translation.episodes_count,
                }
            });
        }
    }

    async updateGroups(result: KodikAnimeFull[]) {
        // Form unique translations from all collected data
        const translations: Map<number, _translation> = new Map<number, _translation>();
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

    static async updateRating() {
        prisma.animeList.count();
        const avgByAll = await prisma.anime.aggregate({
            _avg: {
                shikimoriRating: true
            },
            where: {
                shikimoriRating: { not: 0 }
            }
        });

        const avgByTitle = await prisma.animeList.groupBy({
            by: "animeId",
            _avg: { rating: true },
            where: { rating: { not: 0 } }
        });

        const splitedAvgByTitle = groupArrSplice(avgByTitle, 50);

        for (const pack of splitedAvgByTitle) {
            for (const anime of pack) {
                const ratings = await prisma.animeList.groupBy({
                    by: "rating",
                    where: {
                        rating: { not: 0 },
                        animeId: anime.animeId
                    },
                    _count: { _all: true }
                });
                const ratingsCount = (() => {
                    let count = 0;
                    for (const rate of ratings) {
                        count += rate._count._all;
                    }
                    return count;
                })();
                const rating = (anime._avg.rating! * ratingsCount +
                    avgByAll._avg.shikimoriRating! * config.ratingMinVotes
                ) / (ratingsCount + config.ratingMinVotes);
                await prisma.anime.update({
                    where: { id: anime.animeId },
                    data: { rating: Number(rating.toFixed(2)) }
                });
            }
            await sleep(1000);
        }
    }

    static async updateRelations() {
        const checkMap = new Set<number>();
        let page = 0;
        let length = 0;
        const shikimoriApi = new ShikimoriApiService();
        const kodikApi = new KodikApiService();
        const updateService = new AnimeUpdateService();
        do {
            const anime = await prisma.anime.findMany({
                where: {
                    hasRelation: false,
                },
                take: 50,
                skip: page * 50,
            });
            if (anime.length == 0) break;
            length = anime.length;

            const shikimoriIds: number[] = [];

            for (const single of anime) {
                checkMap.add(single.shikimoriId);
                shikimoriIds.push(single.shikimoriId);
            }
            logger.info(`Requesting batch: ${page} from shikimori`);
            const shikimoriRequest = await shikimoriApi.getBatchGraphAnime(shikimoriIds);
            const shikimoriAnime = shikimoriRequest.data.animes;
            const shikimoriMap = new Map<number, ShikimoriAnimeWithRelation>();

            for (const shikimori of shikimoriAnime) {
                shikimoriMap.set(Number(shikimori.id), shikimori);
                logger.info(`Writing relations for anime ${shikimori.russian ?? shikimori.name}`);
                const relations = new Map<number, ShikimoriRelation>();
                const createAnime = new Map<number, ShikimoriGraphAnime>();

                shikimori.related = shikimori.related.filter(relation => relation.anime !== null);
                for (const relation of shikimori.related) {
                    relations.set(relation.id, relation);

                    if (checkMap.has(Number(relation.anime!.id))) continue;

                    createAnime.set(Number(relation.anime!.id), relation.anime!);
                }
                logger.info(`Getting anime from kodik`);

                const animeInDb = await prisma.anime.findMany({
                    where: {
                        shikimoriId: {
                            in: [...createAnime.keys()]
                        }
                    }
                });

                for (const db of animeInDb) {
                    checkMap.add(db.shikimoriId);
                    createAnime.delete(db.shikimoriId);
                }

                const kodikAnime = await kodikApi.getBatchAnime([...createAnime.keys()]);

                const kodikMap = new Map<number, KodikAnime>();

                for (const kodik of kodikAnime) {
                    kodikMap.set(Number(kodik.shikimori_id), kodik);
                }

                for (const create of createAnime.values()) {
                    await updateService.createShikimoriGraphAnime(create, kodikMap.get(Number(create.id)));
                    checkMap.add(Number(create.id));
                }
                await prisma.anime.update({
                    where: {
                        shikimoriId: Number(shikimori.id),
                    },
                    data: {
                        hasRelation: true
                    }
                });
            }

            await prisma.animeRelation.createFromShikimoriMap(shikimoriMap);
            page++;
        } while (length > 0);
    }

    async seedAnime() {

        let length = 0;
        let page = 1;

        const shikimoriApi = new ShikimoriApiService();
        const kodikApi = new KodikApiService();

        do {
            logger.info(`seeding anime batch: ${page}`);
            const animeRequest = await shikimoriApi.getGraphAnimeByPage(page);
            const anime = animeRequest.data.animes;

            const animeMap = new Map<number, ShikimoriGraphAnime>();

            for (const single of anime) {
                animeMap.set(Number(single.id), single);
            }

            const dbAnime = await prisma.anime.findMany({
                where: {
                    shikimoriId: {
                        in: [...animeMap.keys()]
                    }
                }
            });

            const dbAnimeIds = dbAnime.map(single => single.shikimoriId);

            const addIds = [...animeMap.keys()].filter(x => !dbAnimeIds.includes(x));

            const createAnime: ShikimoriGraphAnime[] = [];

            for (const id of addIds) {
                createAnime.push(animeMap.get(id)!);
            }

            const kodikAnime = await kodikApi.getBatchAnime(addIds);
            const kodikMap = new Map<number, KodikAnime>();

            for (const kodik of kodikAnime) {
                kodikMap.set(Number(kodik.shikimori_id), kodik);
            }

            for (const create of createAnime) {
                await this.createShikimoriGraphAnime(create, kodikMap.get(Number(create.id)));
            }

            logger.info(`Batch ${page} seeded, added ${createAnime.length} titles`);

            length = anime.length;
            page++;
        } while (length > 0);

    }
}
