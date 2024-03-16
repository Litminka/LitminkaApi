-- CreateTable
CREATE TABLE "AnimeRelation" (
    "id" SERIAL NOT NULL,
    "shikimoriId" INTEGER NOT NULL,
    "animeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AnimeRelation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnimeRelation" ADD CONSTRAINT "AnimeRelation_shikimoriId_fkey" FOREIGN KEY ("shikimoriId") REFERENCES "Anime"("shikimoriId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeRelation" ADD CONSTRAINT "AnimeRelation_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
