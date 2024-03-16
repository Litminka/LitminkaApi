-- DropForeignKey
ALTER TABLE "AnimeRelation" DROP CONSTRAINT "AnimeRelation_animeId_fkey";

-- AlterTable
ALTER TABLE "AnimeRelation" ALTER COLUMN "animeId" DROP NOT NULL;
