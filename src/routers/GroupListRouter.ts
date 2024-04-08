import { Router } from "express";
import { wrap } from "@/middleware/errorHandler";
import GroupListController from "@controllers/group/GroupListController";
import GroupInviteController from "@controllers/group/GroupInviteController";
import GroupMemberController from "@controllers/group/GroupMemberController";
import GroupAnimeListController from "@controllers/group/GroupAnimeListController";
import { CreateGroupRequest } from "@requests/group/list/CreateGroupRequest";
import { DeleteGroupRequest } from "@requests/group/list/DeleteGroupRequest";
import { UpdateGroupRequest } from "@requests/group/list/UpdateGroupRequest";
import { GroupRequest } from "@requests/group/GroupRequest";
import { KickGroupMemberRequest } from "@requests/group/member/KickGroupMemberRequest";
import { GroupMemberRequest } from "@requests/group/member/GroupMemberRequest";
import { DeleteInviteRequest } from "@requests/group/invite/DeleteInviteRequest";
import { DenyInviteRequest } from "@requests/group/invite/DenyInviteRequest";
import { AcceptInviteRequest } from "@requests/group/invite/AcceptInviteRequest";
import { SendInviteRequest } from "@requests/group/invite/SendInviteRequest";
import { GetGroupAnimeListRequest } from "@requests/group/animeList/GetGroupAnimeListRequest";
import { AddGroupAnimeListRequest } from "@requests/group/animeList/AddGroupAnimeListRequest";
import { UpdateGroupAnimeListRequest } from "@requests/group/animeList/UpdateGroupAnimeListRequest";
import { DeleteGroupAnimeListRequest } from "@requests/group/animeList/DeleteGroupAnimeListRequest";
import { AuthRequest } from "@requests/AuthRequest";
import { UpdateGroupMemberRequest } from "@requests/group/member/UpdateGroupMemberRequest";

const router = Router();

router.post('/', new CreateGroupRequest().send(), wrap(GroupListController.createGroup));
router.get('/owned', new GroupRequest().send(), wrap(GroupListController.getOwnedGroups));

router.get('/member', new AuthRequest().send(), wrap(GroupMemberController.getMemberGroup));

const groupIdRouter = Router({ mergeParams: true });
router.use('/:groupId', groupIdRouter);

groupIdRouter.delete('/', new DeleteGroupRequest().send(), wrap(GroupListController.deleteGroup));
groupIdRouter.patch('/', new UpdateGroupRequest().send(), wrap(GroupListController.updateGroup));

groupIdRouter.post('/invite', new SendInviteRequest().send(), wrap(GroupInviteController.inviteUser));
groupIdRouter.delete('/invite', new DeleteInviteRequest().send(), wrap(GroupInviteController.deleteInvite));

groupIdRouter.get('/members', new GroupMemberRequest().send(), wrap(GroupMemberController.getMembers));
groupIdRouter.patch('/members', new UpdateGroupMemberRequest().send(), wrap(GroupMemberController.updateState));
groupIdRouter.delete('/members', new GroupMemberRequest().send(), wrap(GroupMemberController.leaveGroup));
groupIdRouter.delete('/members/kick', new KickGroupMemberRequest().send(), wrap(GroupMemberController.kickUser));

const groupListRouter = Router({ mergeParams: true });
groupIdRouter.use('/list', groupListRouter);

groupListRouter.get('/', new GetGroupAnimeListRequest().send(), wrap(GroupAnimeListController.get));
groupListRouter.post('/:animeId', new AddGroupAnimeListRequest().send(), wrap(GroupAnimeListController.add));
groupListRouter.patch('/:animeId', new UpdateGroupAnimeListRequest().send(), wrap(GroupAnimeListController.update));
groupListRouter.delete('/:animeId', new DeleteGroupAnimeListRequest().send(), wrap(GroupAnimeListController.delete));

const invitesRouter = Router({ mergeParams: true });
router.use('/invites', invitesRouter);

invitesRouter.get('', new AuthRequest().send(), wrap(GroupInviteController.getInvites));
invitesRouter.post('/:inviteId/accept', new AcceptInviteRequest().send(), wrap(GroupInviteController.acceptInvite));
invitesRouter.delete('/:inviteId/deny', new DenyInviteRequest().send(), wrap(GroupInviteController.denyInvite));

export { router as groupListRouter };