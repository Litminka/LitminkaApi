/*
  Warnings:

  - You are about to drop the column `shikimoriId` on the `AnimeRelation` table. All the data in the column will be lost.
  - Added the required column `relatedTo` to the `AnimeRelation` table without a default value. This is not possible if the table is not empty.
  - Made the column `animeId` on table `AnimeRelation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AnimeRelation" DROP CONSTRAINT "AnimeRelation_shikimoriId_fkey";

-- AlterTable
ALTER TABLE "AnimeRelation" DROP COLUMN "shikimoriId",
ADD COLUMN     "relatedTo" INTEGER NOT NULL,
ALTER COLUMN "animeId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "AnimeRelation" ADD CONSTRAINT "AnimeRelation_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("shikimoriId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeRelation" ADD CONSTRAINT "AnimeRelation_relatedTo_fkey" FOREIGN KEY ("relatedTo") REFERENCES "Anime"("shikimoriId") ON DELETE RESTRICT ON UPDATE CASCADE;
