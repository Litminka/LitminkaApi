-- CreateTable
CREATE TABLE "Integration" (
    "id" SERIAL NOT NULL,
    "shikimori_token" TEXT NOT NULL,
    "shikimori_refresh_token" TEXT NOT NULL,
    "discord_id" TEXT NOT NULL,
    "telegram_id" TEXT NOT NULL,
    "vk_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "Integration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shikimori_Link_Token" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "Shikimori_Link_Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Integration_user_id_key" ON "Integration"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Shikimori_Link_Token_user_id_key" ON "Shikimori_Link_Token"("user_id");

-- AddForeignKey
ALTER TABLE "Integration" ADD CONSTRAINT "Integration_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shikimori_Link_Token" ADD CONSTRAINT "Shikimori_Link_Token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
