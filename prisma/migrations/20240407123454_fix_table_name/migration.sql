/*
  Warnings:

  - You are about to drop the column `shikimoriImportList` on the `UserSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserSettings" RENAME COLUMN "shikimoriImportList" TO "shikimoriExportList";
ALTER TABLE "UserSettings" ALTER COLUMN "siteTheme" SET DEFAULT 'dark';
