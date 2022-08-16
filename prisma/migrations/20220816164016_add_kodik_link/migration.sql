-- AlterTable
ALTER TABLE "Anime" ADD COLUMN     "kodik_link" TEXT;

-- CreateTable
CREATE TABLE "Settings" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "site_theme" TEXT NOT NULL,
    "notify_discord" BOOLEAN NOT NULL,
    "notify_telegram" BOOLEAN NOT NULL,
    "notify_vk" BOOLEAN NOT NULL,
    "hide_profile" BOOLEAN NOT NULL,
    "hide_sections" TEXT NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Settings_user_id_key" ON "Settings"("user_id");

-- CreateIndex
CREATE INDEX "Anime_translation_group_name_idx" ON "Anime_translation"("group_name");

-- CreateIndex
CREATE INDEX "Follow_status_idx" ON "Follow"("status");

-- CreateIndex
CREATE INDEX "Integration_discord_id_idx" ON "Integration"("discord_id");

-- CreateIndex
CREATE INDEX "Integration_shikimori_id_idx" ON "Integration"("shikimori_id");

-- AddForeignKey
ALTER TABLE "Settings" ADD CONSTRAINT "Settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
