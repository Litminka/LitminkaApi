/*
 Warnings:
 
 - You are about to drop the column `score` on the `Anime` table. All the data in the column will be lost.
 - You are about to drop the column `shikimoriScore` on the `Anime` table. All the data in the column will be lost.
 - Added the required column `shikimoriRating` to the `Anime` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
ALTER TABLE "Anime"
  RENAME COLUMN "score" TO "rating";
ALTER TABLE "Anime"
  RENAME COLUMN "shikimoriScore" TO "shikimoriRating";