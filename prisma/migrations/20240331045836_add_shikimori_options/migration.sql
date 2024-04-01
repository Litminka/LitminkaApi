/*
  Warnings:

  - A unique constraint covering the columns `[shikimoriId]` on the table `AnimeList` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AnimeList" ADD COLUMN     "shikimoriId" INTEGER;

-- AlterTable
ALTER TABLE "Integration" ADD COLUMN     "shikimoriCanChangeList" BOOLEAN DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "AnimeList_shikimoriId_key" ON "AnimeList"("shikimoriId");
