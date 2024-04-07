-- CreateTable
CREATE TABLE "UserSettings" (
    "id" SERIAL NOT NULL,
    "watchListMode" TEXT NOT NULL DEFAULT 'auto',
    "watchListAddAfterEpisodes" INTEGER NOT NULL DEFAULT 3,
    "watchListAskAboutRating" BOOLEAN NOT NULL DEFAULT true,
    "showCensoredContent" BOOLEAN NOT NULL DEFAULT false,
    "shikimoriImportList" BOOLEAN NOT NULL DEFAULT false,
    "notifyDiscord" BOOLEAN NOT NULL DEFAULT false,
    "notifyPush" BOOLEAN NOT NULL DEFAULT false,
    "notifyTelegram" BOOLEAN NOT NULL DEFAULT false,
    "notifyVK" BOOLEAN NOT NULL DEFAULT false,
    "siteTheme" TEXT NOT NULL DEFAULT 'light',
    "userId" INTEGER NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
