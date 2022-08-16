/*
  Warnings:

  - You are about to drop the `Anime_List` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Anime_Translation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Anime_List" DROP CONSTRAINT "Anime_List_anime_id_fkey";

-- DropForeignKey
ALTER TABLE "Anime_List" DROP CONSTRAINT "Anime_List_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Anime_Translation" DROP CONSTRAINT "Anime_Translation_anime_id_fkey";

-- DropForeignKey
ALTER TABLE "Follow" DROP CONSTRAINT "Follow_translation_id_fkey";

-- DropTable
DROP TABLE "Anime_List";

-- DropTable
DROP TABLE "Anime_Translation";

-- CreateTable
CREATE TABLE "Anime_translation" (
    "id" SERIAL NOT NULL,
    "current_episodes" INTEGER,
    "type" TEXT NOT NULL,
    "group_name" TEXT NOT NULL,
    "anime_id" INTEGER NOT NULL,

    CONSTRAINT "Anime_translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anime_list" (
    "id" SERIAL NOT NULL,
    "anime_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "is_favorite" BOOLEAN NOT NULL,
    "watched_episodes" INTEGER NOT NULL,
    "rating" INTEGER,

    CONSTRAINT "Anime_list_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Anime_translation" ADD CONSTRAINT "Anime_translation_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_translation_id_fkey" FOREIGN KEY ("translation_id") REFERENCES "Anime_translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anime_list" ADD CONSTRAINT "Anime_list_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anime_list" ADD CONSTRAINT "Anime_list_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
