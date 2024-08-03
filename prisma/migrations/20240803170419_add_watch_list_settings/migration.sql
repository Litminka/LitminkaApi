-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "watchListAutoAdd" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "watchListIgnoreOptionForLessEpisodes" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "watchListWatchedPercentage" INTEGER NOT NULL DEFAULT 80;
