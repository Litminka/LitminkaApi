/*
  Warnings:

  - A unique constraint covering the columns `[nameRussian]` on the table `Genre` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nameRussian` to the `Genre` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Genre" ADD COLUMN     "nameRussian" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Genre_nameRussian_key" ON "Genre"("nameRussian");
