import { prisma } from "../db";
import { cyrillicSlug } from "../helper/cyrillic-slug";
import { ShikimoriAnime, ShikimoriAnimeFull } from "../ts";

export default class AnimeModel {
    public static async update(id: number, update: ShikimoriAnimeFull ){
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
    }
       
    public static async upsertManyShikimoriFull(animeArr: ShikimoriAnimeFull[]) {
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
    }

    public static async upsertMany(animeArr: ShikimoriAnime[]){
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
    }

    public static async findWithTranlsations(animeId: number){
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
    }

    public static async findWithTranlsationsAndGenres(animeId: number){
        return await prisma.anime.findFirst({
            where: { id: animeId },
            include: {
                genres: true,
                animeTranslations: {
                    include: {
                        group: true
                    }
                }
            }
        })
    }
}