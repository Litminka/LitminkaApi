import { Router } from "express";
import { wrap } from "../middleware/errorHandler";
import GroupListController from "../controllers/group/GroupListController";
import GroupInviteController from "../controllers/group/GroupInviteController";
import GroupMemberController from "../controllers/group/GroupMemberController";
import GroupAnimeListController from "../controllers/group/GroupAnimeListController";
import CreateGroupRequest from "../requests/group/list/CreateGroupRequest";
import DeleteGroupRequest from "../requests/group/list/DeleteGroupRequest";
import UpdateGroupRequest from "../requests/group/list/UpdateGroupRequest";
import OwnedGroupRequest from "../requests/group/list/OwnedGroupsRequest";
import GetMemberGroupRequest from "../requests/group/member/GetMemberGroupRequest";
import GetGroupMembersRequest from "../requests/group/member/GetGroupMembersRequest";
import LeaveGroupRequest from "../requests/group/member/LeaveGroupRequest";
import UpdateMemberStateRequest from "../requests/group/member/UpdateMemberStateRequest";
import KickMemberRequest from "../requests/group/member/KickMemberRequest";
import DeleteInviteRequest from "../requests/group/invite/DeleteInviteRequest";
import DenyInviteRequest from "../requests/group/invite/DenyInviteRequest";
import AcceptInviteRequest from "../requests/group/invite/AcceptInviteRequest";
import SendInviteRequest from "../requests/group/invite/SendInviteRequest";
import GetInvitesRequest from "../requests/group/invite/GetInvitesRequest";
import GetGroupAnimeListRequest from "../requests/group/animeList/GetGroupAnimeListRequest";
import AddGroupAnimeListRequest from "../requests/group/animeList/AddGroupAnimeListRequest";
import UpdateGroupAnimeListRequest from "../requests/group/animeList/UpdateGroupAnimeListRequest";
import DeleteGroupAnimeListRequest from "../requests/group/animeList/DeleteGroupAnimeListRequest";

const router = Router();

router.post('/', new CreateGroupRequest().send(), wrap(GroupListController.createGroup));
router.get('/owned', new OwnedGroupRequest().send(), wrap(GroupListController.getOwnedGroups));

router.get('/member', new GetMemberGroupRequest().send(), wrap(GroupMemberController.getMemberGroup));

const groupIdRouter = Router({ mergeParams: true });
router.use('/:groupId', groupIdRouter);

groupIdRouter.delete('/', new DeleteGroupRequest().send(), wrap(GroupListController.deleteGroup));
groupIdRouter.patch('/', new UpdateGroupRequest().send(), wrap(GroupListController.updateGroup));

groupIdRouter.post('/invite', new SendInviteRequest().send(), wrap(GroupInviteController.inviteUser));
groupIdRouter.delete('/invite', new DeleteInviteRequest().send(), wrap(GroupInviteController.deleteInvite));

groupIdRouter.get('/members', new GetGroupMembersRequest().send(), wrap(GroupMemberController.getMembers));
groupIdRouter.patch('/members', new UpdateMemberStateRequest().send(), wrap(GroupMemberController.updateState));
groupIdRouter.delete('/members', new LeaveGroupRequest().send(), wrap(GroupMemberController.leaveGroup))
groupIdRouter.delete('/members/kick', new KickMemberRequest().send(), wrap(GroupMemberController.kickUser))

const groupListRouter = Router({ mergeParams: true });
groupIdRouter.use('/list', groupListRouter);

groupListRouter.get('/', new GetGroupAnimeListRequest().send(), wrap(GroupAnimeListController.get));
groupListRouter.post('/:animeId', new AddGroupAnimeListRequest().send(), wrap(GroupAnimeListController.add));
groupListRouter.patch('/:animeId', new UpdateGroupAnimeListRequest().send(), wrap(GroupAnimeListController.update));
groupListRouter.delete('/:animeId', new DeleteGroupAnimeListRequest().send(), wrap(GroupAnimeListController.delete));

const invitesRouter = Router({ mergeParams: true });
router.use('/invites', invitesRouter);

invitesRouter.get('', new GetInvitesRequest().send(), wrap(GroupInviteController.getInvites));
invitesRouter.post('/:inviteId/accept', new AcceptInviteRequest().send(), wrap(GroupInviteController.acceptInvite));
invitesRouter.delete('/:inviteId/deny', new DenyInviteRequest().send(), wrap(GroupInviteController.denyInvite));

export { router as groupListRouter }