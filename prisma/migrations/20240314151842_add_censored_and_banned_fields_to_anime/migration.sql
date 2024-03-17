-- AlterTable
ALTER TABLE "Anime" ADD COLUMN     "banned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "censored" BOOLEAN NOT NULL DEFAULT false;
