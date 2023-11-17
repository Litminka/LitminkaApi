/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Anime` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Anime" ADD COLUMN     "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Anime_slug_key" ON "Anime"("slug");
