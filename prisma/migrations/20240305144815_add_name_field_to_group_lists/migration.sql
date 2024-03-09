/*
  Warnings:

  - Added the required column `name` to the `Group_list` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group_list" ADD COLUMN     "name" TEXT NOT NULL;
