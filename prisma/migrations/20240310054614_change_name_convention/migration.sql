/*
  Warnings:

  - You are about to drop the column `current_episodes` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `english_name` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `first_episode_aired` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `franchise_name` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `japanese_name` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `kodik_link` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `last_episode_aired` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `max_episodes` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `media_type` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `rpa_rating` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `shikimori_id` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `shikimori_score` on the `Anime` table. All the data in the column will be lost.
  - You are about to drop the column `anime_id` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `translation_id` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Follow` table. All the data in the column will be lost.
  - You are about to drop the column `discord_id` on the `Integration` table. All the data in the column will be lost.
  - You are about to drop the column `shikimori_code` on the `Integration` table. All the data in the column will be lost.
  - You are about to drop the column `shikimori_id` on the `Integration` table. All the data in the column will be lost.
  - You are about to drop the column `shikimori_refresh_token` on the `Integration` table. All the data in the column will be lost.
  - You are about to drop the column `shikimori_token` on the `Integration` table. All the data in the column will be lost.
  - You are about to drop the column `telegram_id` on the `Integration` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Integration` table. All the data in the column will be lost.
  - You are about to drop the column `vk_id` on the `Integration` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `RefreshToken` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Anime_list` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Anime_notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Anime_translation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Group_anime_list` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Group_list` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Group_list_invites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Group_list_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Shikimori_Link_Token` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_anime_notifications` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[shikimoriId]` on the table `Anime` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shikimoriId]` on the table `Integration` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Integration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `currentEpisodes` to the `Anime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxEpisodes` to the `Anime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shikimoriId` to the `Anime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shikimoriScore` to the `Anime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `animeId` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Follow` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Integration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Anime_list" DROP CONSTRAINT "Anime_list_anime_id_fkey";

-- DropForeignKey
ALTER TABLE "Anime_list" DROP CONSTRAINT "Anime_list_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Anime_notifications" DROP CONSTRAINT "Anime_notifications_anime_id_fkey";

-- DropForeignKey
ALTER TABLE "Anime_notifications" DROP CONSTRAINT "Anime_notifications_group_id_fkey";

-- DropForeignKey
ALTER TABLE "Anime_translation" DROP CONSTRAINT "Anime_translation_anime_id_fkey";

-- DropForeignKey
ALTER TABLE "Anime_translation" DROP CONSTRAINT "Anime_translation_group_id_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_anime_id_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_translation_id_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Group_anime_list" DROP CONSTRAINT "Group_anime_list_anime_id_fkey";

-- DropForeignKey
ALTER TABLE "Group_anime_list" DROP CONSTRAINT "Group_anime_list_group_id_fkey";

-- DropForeignKey
ALTER TABLE "Group_list" DROP CONSTRAINT "Group_list_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "Group_list_invites" DROP CONSTRAINT "Group_list_invites_group_id_fkey";

-- DropForeignKey
ALTER TABLE "Group_list_invites" DROP CONSTRAINT "Group_list_invites_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Group_list_members" DROP CONSTRAINT "Group_list_members_group_id_fkey";

-- DropForeignKey
ALTER TABLE "Group_list_members" DROP CONSTRAINT "Group_list_members_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Integration" DROP CONSTRAINT "Integration_user_id_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Shikimori_Link_Token" DROP CONSTRAINT "Shikimori_Link_Token_user_id_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_role_id_fkey";

-- DropForeignKey
ALTER TABLE "User_anime_notifications" DROP CONSTRAINT "User_anime_notifications_anime_id_fkey";

-- DropForeignKey
ALTER TABLE "User_anime_notifications" DROP CONSTRAINT "User_anime_notifications_group_id_fkey";

-- DropForeignKey
ALTER TABLE "User_anime_notifications" DROP CONSTRAINT "User_anime_notifications_user_id_fkey";

-- DropIndex
DROP INDEX "Anime_shikimori_id_key";

-- DropIndex
DROP INDEX "Integration_shikimori_id_key";

-- DropIndex
DROP INDEX "Integration_user_id_key";

-- AlterTable
ALTER TABLE "Anime" DROP COLUMN "current_episodes",
DROP COLUMN "english_name",
DROP COLUMN "first_episode_aired",
DROP COLUMN "franchise_name",
DROP COLUMN "japanese_name",
DROP COLUMN "kodik_link",
DROP COLUMN "last_episode_aired",
DROP COLUMN "max_episodes",
DROP COLUMN "media_type",
DROP COLUMN "rpa_rating",
DROP COLUMN "shikimori_id",
DROP COLUMN "shikimori_score",
ADD COLUMN     "currentEpisodes" INTEGER NOT NULL,
ADD COLUMN     "englishName" TEXT,
ADD COLUMN     "firstEpisodeAired" TIMESTAMP(3),
ADD COLUMN     "franchiseName" TEXT,
ADD COLUMN     "japaneseName" TEXT,
ADD COLUMN     "kodikLink" TEXT,
ADD COLUMN     "lastEpisodeAired" TIMESTAMP(3),
ADD COLUMN     "maxEpisodes" INTEGER NOT NULL,
ADD COLUMN     "mediaType" TEXT,
ADD COLUMN     "rpaRating" TEXT,
ADD COLUMN     "shikimoriId" INTEGER NOT NULL,
ADD COLUMN     "shikimoriScore" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Follow" DROP COLUMN "anime_id",
DROP COLUMN "translation_id",
DROP COLUMN "user_id",
ADD COLUMN     "animeId" INTEGER NOT NULL,
ADD COLUMN     "translationId" INTEGER,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Integration" DROP COLUMN "discord_id",
DROP COLUMN "shikimori_code",
DROP COLUMN "shikimori_id",
DROP COLUMN "shikimori_refresh_token",
DROP COLUMN "shikimori_token",
DROP COLUMN "telegram_id",
DROP COLUMN "user_id",
DROP COLUMN "vk_id",
ADD COLUMN     "discordId" TEXT,
ADD COLUMN     "shikimoriCode" TEXT,
ADD COLUMN     "shikimoriId" INTEGER,
ADD COLUMN     "shikimoriRefreshToken" TEXT,
ADD COLUMN     "shikimoriToken" TEXT,
ADD COLUMN     "telegramId" TEXT,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD COLUMN     "vkId" TEXT;

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "user_id",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "created_at",
DROP COLUMN "role_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "roleId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Anime_list";

-- DropTable
DROP TABLE "Anime_notifications";

-- DropTable
DROP TABLE "Anime_translation";

-- DropTable
DROP TABLE "Group_anime_list";

-- DropTable
DROP TABLE "Group_list";

-- DropTable
DROP TABLE "Group_list_invites";

-- DropTable
DROP TABLE "Group_list_members";

-- DropTable
DROP TABLE "Shikimori_Link_Token";

-- DropTable
DROP TABLE "User_anime_notifications";

-- CreateTable
CREATE TABLE "ShikimoriLinkToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "ShikimoriLinkToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimeTranslation" (
    "id" SERIAL NOT NULL,
    "currentEpisodes" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "animeId" INTEGER NOT NULL,

    CONSTRAINT "AnimeTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimeList" (
    "id" SERIAL NOT NULL,
    "animeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL,
    "watchedEpisodes" INTEGER NOT NULL,
    "rating" INTEGER,

    CONSTRAINT "AnimeList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupList" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "GroupList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupListInvites" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "GroupListInvites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupListMembers" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "overrideList" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GroupListMembers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupAnimeList" (
    "id" SERIAL NOT NULL,
    "animeId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL,
    "watchedEpisodes" INTEGER NOT NULL,
    "rating" INTEGER,

    CONSTRAINT "GroupAnimeList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnimeNotifications" (
    "id" SERIAL NOT NULL,
    "animeId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "episode" INTEGER,
    "groupId" INTEGER,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAnimeNotifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnimeNotifications" (
    "id" SERIAL NOT NULL,
    "animeId" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "episode" INTEGER,
    "groupId" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnimeNotifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShikimoriLinkToken_userId_key" ON "ShikimoriLinkToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ShikimoriLinkToken_token_key" ON "ShikimoriLinkToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Anime_shikimoriId_key" ON "Anime"("shikimoriId");

-- CreateIndex
CREATE UNIQUE INDEX "Integration_shikimoriId_key" ON "Integration"("shikimoriId");

-- CreateIndex
CREATE UNIQUE INDEX "Integration_userId_key" ON "Integration"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShikimoriLinkToken" ADD CONSTRAINT "ShikimoriLinkToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeTranslation" ADD CONSTRAINT "AnimeTranslation_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeTranslation" ADD CONSTRAINT "AnimeTranslation_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_translationId_fkey" FOREIGN KEY ("translationId") REFERENCES "AnimeTranslation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeList" ADD CONSTRAINT "AnimeList_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeList" ADD CONSTRAINT "AnimeList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupList" ADD CONSTRAINT "GroupList_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupListInvites" ADD CONSTRAINT "GroupListInvites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupListInvites" ADD CONSTRAINT "GroupListInvites_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "GroupList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupListMembers" ADD CONSTRAINT "GroupListMembers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupListMembers" ADD CONSTRAINT "GroupListMembers_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "GroupList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupAnimeList" ADD CONSTRAINT "GroupAnimeList_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupAnimeList" ADD CONSTRAINT "GroupAnimeList_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "GroupList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnimeNotifications" ADD CONSTRAINT "UserAnimeNotifications_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnimeNotifications" ADD CONSTRAINT "UserAnimeNotifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnimeNotifications" ADD CONSTRAINT "UserAnimeNotifications_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeNotifications" ADD CONSTRAINT "AnimeNotifications_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeNotifications" ADD CONSTRAINT "AnimeNotifications_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
