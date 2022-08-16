/*
  Warnings:

  - The primary key for the `Anime_list` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Anime_list` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Anime_list" DROP CONSTRAINT "Anime_list_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Anime_list_pkey" PRIMARY KEY ("user_id");
