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
    }
       
    public static async upsertManyShikimoriFull(animeArr: ShikimoriAnimeFull[]) {
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

    public static async upsertMany(animeArr: ShikimoriAnime[]){
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

    public static async findWithTranlsations(anime_id: number){
        return await prisma.anime.findFirstOrThrow({
            where: { id: anime_id },
            include: {
                anime_translations: {
                    include: {
                        group: true
                    }
                }
            }
        })
    }

    public static async findWithTranlsationsAndGenres(anime_id: number){
        return await prisma.anime.findFirst({
            where: { id: anime_id },
            include: {
                genres: true,
                anime_translations: {
                    include: {
                        group: true
                    }
                }
            }
        })
    }
}