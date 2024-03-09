-- DropForeignKey
ALTER TABLE "Group_anime_list" DROP CONSTRAINT "Group_anime_list_group_id_fkey";

-- DropForeignKey
ALTER TABLE "Group_list_invites" DROP CONSTRAINT "Group_list_invites_group_id_fkey";

-- DropForeignKey
ALTER TABLE "Group_list_members" DROP CONSTRAINT "Group_list_members_group_id_fkey";

-- AddForeignKey
ALTER TABLE "Group_list_invites" ADD CONSTRAINT "Group_list_invites_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group_list_members" ADD CONSTRAINT "Group_list_members_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group_anime_list" ADD CONSTRAINT "Group_anime_list_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;
