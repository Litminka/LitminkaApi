/*
  Warnings:

  - A unique constraint covering the columns `[shikimori_id]` on the table `Integration` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Integration" ADD COLUMN     "shikimori_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Integration_shikimori_id_key" ON "Integration"("shikimori_id");
