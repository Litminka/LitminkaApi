-- CreateTable
CREATE TABLE "Group_list" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Group_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group_list_invites" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "list_id" INTEGER NOT NULL,

    CONSTRAINT "Group_list_invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group_list_members" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "override_list" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Group_list_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group_anime_list" (
    "id" SERIAL NOT NULL,
    "anime_id" INTEGER NOT NULL,
    "group_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "is_favorite" BOOLEAN NOT NULL,
    "watched_episodes" INTEGER NOT NULL,
    "rating" INTEGER,

    CONSTRAINT "Group_anime_list_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Group_list" ADD CONSTRAINT "Group_list_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group_list_invites" ADD CONSTRAINT "Group_list_invites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group_list_invites" ADD CONSTRAINT "Group_list_invites_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "Group_list"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group_list_members" ADD CONSTRAINT "Group_list_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group_list_members" ADD CONSTRAINT "Group_list_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group_list"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group_anime_list" ADD CONSTRAINT "Group_anime_list_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "Anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group_anime_list" ADD CONSTRAINT "Group_anime_list_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group_list"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
