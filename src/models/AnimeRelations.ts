import { Prisma } from "@prisma/client";
import prisma from "../db";
import { ShikimoriAnimeWithRelation } from "../ts/shikimori";

const extention = Prisma.defineExtension({
    name: "AnimeRelationModel",
    model: {
        animeRelation: {
            async createFromShikimoriMap(shikimoriMap: Map<number, ShikimoriAnimeWithRelation>) {
                for (const [id, shikimoriAnime] of shikimoriMap) {
                    const relations = shikimoriAnime.related.filter(relation => relation.anime !== null);
                    await prisma.animeRelation.createMany({
                        data: relations.map(anime => {
                            return {
                                name: anime.relationRu,
                                animeId: id,
                                relatedTo: Number(anime.anime!.id),
                            }
                        }),
                    })
                }
            }
        }
    }
});

export { extention as AnimeRelationExt }