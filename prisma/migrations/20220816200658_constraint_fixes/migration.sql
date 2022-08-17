-- DropForeignKey
ALTER TABLE "Anime_translation" DROP CONSTRAINT "Anime_translation_anime_id_fkey";

-- DropForeignKey
ALTER TABLE "Anime_translation" DROP CONSTRAINT "Anime_translation_group_id_fkey";

-- AddForeignKey
ALTER TABLE "Anime_translation" ADD CONSTRAINT "Anime_translation_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anime_translation" ADD CONSTRAINT "Anime_translation_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;
