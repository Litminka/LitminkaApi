-- CreateTable
CREATE TABLE "User_anime_notifications" (
    "id" SERIAL NOT NULL,
    "anime_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "episode" INTEGER,
    "group_id" INTEGER,

    CONSTRAINT "User_anime_notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User_anime_notifications" ADD CONSTRAINT "User_anime_notifications_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_anime_notifications" ADD CONSTRAINT "User_anime_notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_anime_notifications" ADD CONSTRAINT "User_anime_notifications_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
