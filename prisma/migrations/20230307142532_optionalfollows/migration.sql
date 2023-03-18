-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_translation_id_fkey";

-- AlterTable
ALTER TABLE "Follow" ALTER COLUMN "translation_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_translation_id_fkey" FOREIGN KEY ("translation_id") REFERENCES "Anime_translation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
