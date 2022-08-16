/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `Shikimori_Link_Token` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Shikimori_Link_Token_token_key" ON "Shikimori_Link_Token"("token");
