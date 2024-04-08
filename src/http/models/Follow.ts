import { Prisma } from "@prisma/client";
import prisma from "@/db";
import { FollowAnime } from "@/ts";

const extention = Prisma.defineExtension({
    name: "FollowModel",
    model: {
        follow: {
            async findFollow({ animeId, userId, status, translationGroupName }: FollowAnime) {
                return await prisma.follow.findFirst({
                    where: {
                        animeId,
                        userId,
                        status,
                        translation: {
                            group: {
                                name: translationGroupName
                            }
                        }
                    }
                });
            },
            async removeFollow({ animeId, userId, translationId }: FollowAnime) {
                await prisma.follow.deleteMany({
                    where: {
                        userId,
                        animeId,
                        translationId
                    }
                });
            }
        }
    }
});

export { extention as FollowExt };