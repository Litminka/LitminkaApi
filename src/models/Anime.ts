
import { Anime, Prisma } from "@prisma/client";
import { KodikAnime } from "@/ts/kodik";
import capitalize from "@/helper/capitalize";
import { config } from "@/config";
import prisma from "@/db";
import { cyrillicSlug } from "@/helper/cyrillic-slug";
import { ShikimoriAnime, ShikimoriAnimeFull } from "@/ts";
import { ShikimoriGraphAnime } from "@/ts/shikimori";

const extention = Prisma.defineExtension({
    name: "AnimeModel",
    model: {
        anime: {
            /**
             * @deprecated
             * @param id 
             * @param update 
             */
            async updateShikimori(id: number, update: ShikimoriAnimeFull) {
                await prisma.anime.update({
                    where: {
                        id
                    },
                    data: {
                        shikimoriScore: parseFloat(update.score),
                        description: update.description,
                        japaneseName: update.japanese ? update.japanese[0] : null,
                        franchiseName: update.franchise,
                        rpaRating: update.rating,
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
            },
            /**
             * @deprecated
             * @param animeArr 
             * @returns 
             */
            async upsertManyShikimoriFull(animeArr: ShikimoriAnimeFull[]) {
                const shikimoriTransaction = animeArr.map((anime) => {
                    return prisma.anime.upsert({
                        where: {
                            shikimoriId: anime.id,
                        },
                        create: {
                            currentEpisodes: anime.episodes_aired,
                            maxEpisodes: anime.episodes,
                            shikimoriId: anime.id,
                            englishName: anime.name,
                            japaneseName: anime.japanese[0] ?? "",
                            slug: `${anime.id}-${cyrillicSlug(anime.russian ? anime.russian : anime.name)}`,
                            description: anime.description,
                            franchiseName: anime.franchise,
                            genres: {
                                connectOrCreate: anime.genres!.map(name => {
                                    return {
                                        where: { name: name.russian },
                                        create: { name: name.russian }
                                    }
                                })
                            },
                            rpaRating: anime.rating,
                            status: anime.status,
                            image: anime.image.original,
                            name: anime.russian,
                            mediaType: anime.kind,
                            shikimoriScore: parseFloat(anime.score),
                            firstEpisodeAired: new Date(anime.aired_on),
                            lastEpisodeAired: new Date(anime.released_on),
                        },
                        update: {
                            currentEpisodes: anime.episodes_aired,
                            maxEpisodes: anime.episodes,
                            status: anime.status,
                            description: anime.description,
                            franchiseName: anime.franchise,
                            mediaType: anime.kind,
                            japaneseName: anime.japanese[0] ?? "",
                            image: anime.image.original,
                            shikimoriScore: parseFloat(anime.score),
                            firstEpisodeAired: new Date(anime.aired_on),
                            lastEpisodeAired: new Date(anime.released_on),
                        }
                    });
                });
                // Insert shikimori anime
                const shikimoriUpdate = await prisma.$transaction(shikimoriTransaction);
                return shikimoriUpdate;
            },
            /**
             * @deprecated
             * @param animeArr 
             * @returns 
             */
            async upsertMany(animeArr: ShikimoriAnime[]) {
                const shikimoriTransaction = animeArr.map((anime) => {
                    return prisma.anime.upsert({
                        where: {
                            shikimoriId: anime.id,
                        },
                        create: {
                            currentEpisodes: anime.episodes_aired,
                            maxEpisodes: anime.episodes,
                            shikimoriId: anime.id,
                            englishName: anime.name,
                            slug: `${anime.id}-${cyrillicSlug(anime.russian ? anime.russian : anime.name)}`,
                            status: anime.status,
                            image: anime.image.original,
                            name: anime.russian,
                            mediaType: anime.kind,
                            shikimoriScore: parseFloat(anime.score),
                            firstEpisodeAired: new Date(anime.aired_on),
                            lastEpisodeAired: new Date(anime.released_on),
                        },
                        update: {
                            currentEpisodes: anime.episodes_aired,
                            maxEpisodes: anime.episodes,
                            status: anime.status,
                            image: anime.image.original,
                            mediaType: anime.kind,
                            shikimoriScore: parseFloat(anime.score),
                            firstEpisodeAired: new Date(anime.aired_on),
                            lastEpisodeAired: new Date(anime.released_on),
                        }
                    });
                });
                // Insert shikimori anime
                const shikimoriUpdate = await prisma.$transaction(shikimoriTransaction);
                return shikimoriUpdate;
            },
            async findWithTranlsations(animeId: number) {
                return await prisma.anime.findFirstOrThrow({
                    where: { id: animeId },
                    include: {
                        animeTranslations: {
                            include: {
                                group: true
                            }
                        }
                    }
                })
            },
            async findWithTranlsationsAndGenres(animeId: number) {
                return await prisma.anime.findFirst({
                    where: { id: animeId },
                    include: {
                        genres: true,
                        animeTranslations: {
                            include: {
                                group: true
                            }
                        },
                        relations: true,
                    }
                })
            },
            async getBatchAnimeShikimori(shikimoriIds: number[]) {
                return prisma.anime.findMany({
                    where: {
                        shikimoriId: {
                            in: shikimoriIds
                        }
                    }
                });
            },
            async updateFromShikimoriGraph(shikimori: ShikimoriGraphAnime, hasRelation: boolean, anime: Anime, kodikAnime?: KodikAnime) {
                let name = shikimori.russian ?? shikimori.name;
                const slug = `${shikimori.id}-${cyrillicSlug(name)}`;

                shikimori.licensors = shikimori.licensors.filter(licensor => !config.ignoreLicensors.includes(licensor));

                // TODO: Too many titles are getting banned
                let isBanned = shikimori.licensors.length > 0;
                if (anime.banned) {
                    isBanned = true;
                }

                let isCensored = shikimori.isCensored;
                if (anime.censored) {
                    isCensored = true;
                }

                return await prisma.anime.update({
                    where: {
                        shikimoriId: Number(shikimori.id),
                    },
                    data: {
                        slug,
                        name: shikimori.russian ?? shikimori.name,
                        englishName: shikimori.name,
                        japaneseName: shikimori.japanese,
                        image: shikimori.poster !== null ? shikimori.poster.originalUrl : undefined,
                        description: shikimori.description,
                        franchiseName: shikimori.franchise,
                        maxEpisodes: shikimori.episodes,
                        currentEpisodes: shikimori.episodesAired,
                        shikimoriScore: shikimori.score ?? 0,
                        mediaType: shikimori.kind,
                        rpaRating: shikimori.rating,
                        status: shikimori.status!,
                        firstEpisodeAired: shikimori.airedOn.date ? new Date(shikimori.airedOn.date) : null,
                        lastEpisodeAired: shikimori.releasedOn.date ? new Date(shikimori.releasedOn.date) : null,
                        banned: isBanned,
                        censored: isCensored,
                        kodikLink: kodikAnime?.link,
                        hasRelation: anime.hasRelation ? anime.hasRelation : hasRelation
                    }
                });

            },
            async createFromShikimoriGraph(shikimori: ShikimoriGraphAnime, hasRelation: boolean = false, kodikAnime?: KodikAnime) {
                let name = shikimori.russian ?? shikimori.name;
                const slug = `${shikimori.id}-${cyrillicSlug(name)}`;
                // TODO: Too many titles are getting banned

                shikimori.licensors = shikimori.licensors.filter(licensor => !config.ignoreLicensors.includes(licensor));
                let isBanned = shikimori.licensors.length > 0;
                let isCensored = shikimori.isCensored;

                const translations = kodikAnime?.translations;

                const hasTranslations = translations !== undefined;

                if (!shikimori.poster) {
                    console.log(shikimori.id);
                }

                return await prisma.anime.create({
                    data: {
                        slug,
                        shikimoriId: Number(shikimori.id),
                        name: shikimori.russian ?? shikimori.name,
                        englishName: shikimori.name,
                        japaneseName: shikimori.japanese,
                        image: shikimori.poster !== null ? shikimori.poster.originalUrl : undefined,
                        description: shikimori.description,
                        franchiseName: shikimori.franchise,
                        maxEpisodes: shikimori.episodes,
                        currentEpisodes: shikimori.episodesAired,
                        shikimoriScore: shikimori.score ?? 0,
                        mediaType: shikimori.kind,
                        rpaRating: shikimori.rating,
                        status: shikimori.status!,
                        firstEpisodeAired: shikimori.airedOn.date ? new Date(shikimori.airedOn.date) : null,
                        lastEpisodeAired: shikimori.releasedOn.date ? new Date(shikimori.releasedOn.date) : null,
                        kodikLink: kodikAnime?.link,
                        banned: isBanned,
                        censored: isCensored,
                        hasRelation, // this assumes that relation will be created after
                        genres: {
                            connectOrCreate: shikimori.genres.map(genre => {
                                return {
                                    where: {
                                        name: capitalize(genre.russian)
                                    },
                                    create: {
                                        name: capitalize(genre.russian)
                                    },

                                };
                            })
                        },
                        animeTranslations: hasTranslations ? {
                            createMany: {
                                data: translations!.map(translation => {
                                    return {
                                        currentEpisodes: translation.episodes_count,
                                        groupId: translation.id,
                                    }
                                })
                            }
                        } : undefined
                    }
                });
            }
        }
    }
})



export { extention as AnimeExt }