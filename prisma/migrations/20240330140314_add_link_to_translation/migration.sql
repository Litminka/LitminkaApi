/*
  Warnings:

  - Added the required column `link` to the `AnimeTranslation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AnimeTranslation" ADD COLUMN     "link" TEXT NOT NULL;
