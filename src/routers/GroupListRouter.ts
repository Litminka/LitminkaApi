import { Router } from 'express';
import GroupListController from '@controllers/group/GroupListController';
import GroupInviteController from '@controllers/group/GroupInviteController';
import GroupMemberController from '@controllers/group/GroupMemberController';
import GroupAnimeListController from '@controllers/group/GroupAnimeListController';
import { createGroupReq } from '@requests/group/list/CreateGroupRequest';
import { deleteGroupReq } from '@requests/group/list/DeleteGroupRequest';
import { updateGroupReq } from '@requests/group/list/UpdateGroupRequest';
import { groupReq } from '@requests/group/GroupRequest';
import { kickGroupMemberReq } from '@requests/group/member/KickGroupMemberRequest';
import { groupMemberReq } from '@requests/group/member/GroupMemberRequest';
import { deleteInviteReq } from '@requests/group/invite/DeleteInviteRequest';
import { denyInviteReq } from '@requests/group/invite/DenyInviteRequest';
import { acceptInviteReq } from '@requests/group/invite/AcceptInviteRequest';
import { sendInviteReq } from '@requests/group/invite/SendInviteRequest';
import { getGroupAnimeListReq } from '@requests/group/animeList/GetGroupAnimeListRequest';
import { addGroupAnimeListReq } from '@requests/group/animeList/AddGroupAnimeListRequest';
import { updateGroupAnimeListReq } from '@requests/group/animeList/UpdateGroupAnimeListRequest';
import { deleteGroupAnimeListReq } from '@requests/group/animeList/DeleteGroupAnimeListRequest';
import { updateGroupMemberReq } from '@requests/group/member/UpdateGroupMemberRequest';
import { authReq } from '@requests/AuthRequest';
import { wrap } from '@/middleware/errorHandler';

const router = Router();

router.post('/', createGroupReq, wrap(GroupListController.createGroup));

router.get('/owned', groupReq, wrap(GroupListController.getOwnedGroups));
router.get('/member', authReq, wrap(GroupMemberController.getMemberGroup));

const groupIdRouter = Router({ mergeParams: true });
router.use('/:groupId', groupIdRouter);

groupIdRouter.delete('/', deleteGroupReq, wrap(GroupListController.deleteGroup));
groupIdRouter.patch('/', updateGroupReq, wrap(GroupListController.updateGroup));

groupIdRouter.post('/invite', sendInviteReq, wrap(GroupInviteController.inviteUser));
groupIdRouter.delete('/invite', deleteInviteReq, wrap(GroupInviteController.deleteInvite));

groupIdRouter.get('/members', groupMemberReq, wrap(GroupMemberController.getMembers));
groupIdRouter.patch('/members', updateGroupMemberReq, wrap(GroupMemberController.updateState));
groupIdRouter.delete('/members', groupMemberReq, wrap(GroupMemberController.leaveGroup));
groupIdRouter.delete('/members/kick', kickGroupMemberReq, wrap(GroupMemberController.kickUser));

const groupListRouter = Router({ mergeParams: true });
groupIdRouter.use('/list', groupListRouter);

groupListRouter.get('/', getGroupAnimeListReq, wrap(GroupAnimeListController.get));
groupListRouter.post('/:animeId', addGroupAnimeListReq, wrap(GroupAnimeListController.add));
groupListRouter.patch('/:animeId', updateGroupAnimeListReq, wrap(GroupAnimeListController.update));
groupListRouter.delete('/:animeId', deleteGroupAnimeListReq, wrap(GroupAnimeListController.delete));

const invitesRouter = Router({ mergeParams: true });
router.use('/invites', invitesRouter);

invitesRouter.get('', authReq, wrap(GroupInviteController.getInvites));
invitesRouter.post('/:inviteId/accept', acceptInviteReq, wrap(GroupInviteController.acceptInvite));
invitesRouter.delete('/:inviteId/deny', denyInviteReq, wrap(GroupInviteController.denyInvite));

export { router as groupListRouter };
