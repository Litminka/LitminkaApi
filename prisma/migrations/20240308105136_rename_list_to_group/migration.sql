/*
  Warnings:

  - You are about to drop the column `list_id` on the `Group_list_invites` table. All the data in the column will be lost.
  - Added the required column `group_id` to the `Group_list_invites` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Group_list_invites" DROP CONSTRAINT "Group_list_invites_list_id_fkey";

-- AlterTable
ALTER TABLE "Group_list_invites" DROP COLUMN "list_id",
ADD COLUMN     "group_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Group_list_invites" ADD CONSTRAINT "Group_list_invites_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "Group_list"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
