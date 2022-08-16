/*
  Warnings:

  - You are about to drop the column `group_name` on the `Anime_translation` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Anime_translation` table. All the data in the column will be lost.
  - Added the required column `group_id` to the `Anime_translation` table without a default value. This is not possible if the table is not empty.
  - Made the column `current_episodes` on table `Anime_translation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Anime_translation_group_name_idx";

-- AlterTable
ALTER TABLE "Anime_translation" DROP COLUMN "group_name",
DROP COLUMN "type",
ADD COLUMN     "group_id" INTEGER NOT NULL,
ALTER COLUMN "current_episodes" SET NOT NULL;

-- CreateTable
CREATE TABLE "Group" (
    "id" INTEGER NOT NULL,
    "group_name" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Group_group_name_idx" ON "Group"("group_name");

-- AddForeignKey
ALTER TABLE "Anime_translation" ADD CONSTRAINT "Anime_translation_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
