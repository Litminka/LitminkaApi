/*
  Warnings:

  - Made the column `slug` on table `Anime` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Anime" ALTER COLUMN "slug" SET NOT NULL;
