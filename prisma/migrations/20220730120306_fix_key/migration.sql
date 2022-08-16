/*
  Warnings:

  - The primary key for the `Anime_list` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Anime_list" DROP CONSTRAINT "Anime_list_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Anime_list_pkey" PRIMARY KEY ("id");
