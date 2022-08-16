-- AlterTable
ALTER TABLE "Integration" ADD COLUMN     "shikimori_code" TEXT,
ALTER COLUMN "shikimori_token" DROP NOT NULL,
ALTER COLUMN "shikimori_refresh_token" DROP NOT NULL,
ALTER COLUMN "discord_id" DROP NOT NULL,
ALTER COLUMN "telegram_id" DROP NOT NULL,
ALTER COLUMN "vk_id" DROP NOT NULL;
