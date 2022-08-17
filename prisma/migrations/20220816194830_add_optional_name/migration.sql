/*
  Warnings:

  - You are about to drop the `Settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Settings" DROP CONSTRAINT "Settings_user_id_fkey";

-- DropIndex
DROP INDEX "Follow_status_idx";

-- DropIndex
DROP INDEX "Integration_discord_id_idx";

-- DropIndex
DROP INDEX "Integration_shikimori_id_idx";

-- AlterTable
ALTER TABLE "Anime" ALTER COLUMN "english_name" DROP NOT NULL;

-- DropTable
DROP TABLE "Settings";
