/*
  Warnings:

  - A unique constraint covering the columns `[shikimori_id]` on the table `Anime` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shikimori_score` to the `Anime` table without a default value. This is not possible if the table is not empty.
  - Made the column `english_name` on table `Anime` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Anime" ADD COLUMN     "shikimori_score" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "japanese_name" DROP NOT NULL,
ALTER COLUMN "english_name" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Anime_shikimori_id_key" ON "Anime"("shikimori_id");
