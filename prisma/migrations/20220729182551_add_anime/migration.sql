-- CreateTable
CREATE TABLE "Anime" (
    "id" SERIAL NOT NULL,
    "shikimori_id" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "japanese_name" TEXT NOT NULL,
    "english_name" TEXT,
    "name" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL,
    "rpa_rating" TEXT NOT NULL,
    "media_type" TEXT NOT NULL,
    "max_episodes" INTEGER NOT NULL,
    "current_episodes" INTEGER NOT NULL,
    "first_episode_aired" TIMESTAMP(3),
    "last_episode_aired" TIMESTAMP(3),
    "franchise_name" TEXT,

    CONSTRAINT "Anime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anime_Translation" (
    "id" SERIAL NOT NULL,
    "current_episodes" INTEGER,
    "type" TEXT NOT NULL,
    "group_name" TEXT NOT NULL,
    "anime_id" INTEGER NOT NULL,

    CONSTRAINT "Anime_Translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "anime_id" INTEGER NOT NULL,
    "translation_id" INTEGER NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Anime_List" (
    "id" SERIAL NOT NULL,
    "anime_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "is_favorite" BOOLEAN NOT NULL,
    "watched_episodes" INTEGER NOT NULL,
    "rating" INTEGER,

    CONSTRAINT "Anime_List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AnimeToGenre" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AnimeToGenre_AB_unique" ON "_AnimeToGenre"("A", "B");

-- CreateIndex
CREATE INDEX "_AnimeToGenre_B_index" ON "_AnimeToGenre"("B");

-- AddForeignKey
ALTER TABLE "Anime_Translation" ADD CONSTRAINT "Anime_Translation_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_translation_id_fkey" FOREIGN KEY ("translation_id") REFERENCES "Anime_Translation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anime_List" ADD CONSTRAINT "Anime_List_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Anime_List" ADD CONSTRAINT "Anime_List_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnimeToGenre" ADD CONSTRAINT "_AnimeToGenre_A_fkey" FOREIGN KEY ("A") REFERENCES "Anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AnimeToGenre" ADD CONSTRAINT "_AnimeToGenre_B_fkey" FOREIGN KEY ("B") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
