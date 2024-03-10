import { Router } from "express";
import { wrap } from "../middleware/errorHandler";
import { auth } from "../middleware/auth";
import GroupListController from "../controllers/group/GroupListController";
import { addToGroupListValidator, createGroupListValidator, groupInviteActionValidator, groupInviteValidator, groupListIdValidator, groupListIdWithUserIdValidator } from "../validators/GroupListValidator";
import GroupInviteController from "../controllers/group/GroupInviteController";
import GroupMemberController from "../controllers/group/GroupMemberController";
import GroupAnimeListController from "../controllers/group/GroupAnimeListController";
import { deleteFromWatchListValidation } from "../validators/WatchListValidator";

const router = Router();
router.use(auth)

router.post('/', createGroupListValidator(), wrap(GroupListController.createGroup));
router.get('/owned', wrap(GroupListController.getOwnedGroups));
router.get('/member', wrap(GroupMemberController.getMemberGroup));

const groupIdRouter = Router({ mergeParams: true });
router.use('/:groupId', groupIdRouter);

groupIdRouter.delete('/', groupListIdValidator(), wrap(GroupListController.deleteGroup));
groupIdRouter.patch('/', groupListIdValidator(), wrap(GroupListController.updateGroup));

groupIdRouter.post('/invite', groupInviteValidator(), wrap(GroupInviteController.inviteUser));
groupIdRouter.delete('/invite', groupInviteValidator(), wrap(GroupInviteController.deleteInvite));
groupIdRouter.get('/members', groupListIdValidator(), wrap(GroupMemberController.getMembers));
groupIdRouter.patch('/members', groupListIdValidator(), wrap(GroupMemberController.updateState));
groupIdRouter.delete('/members', groupListIdValidator(), wrap(GroupMemberController.leaveGroup))
groupIdRouter.delete('/members/kick', groupListIdWithUserIdValidator(), wrap(GroupMemberController.kickUser))

const groupListRouter = Router({ mergeParams: true });
groupIdRouter.use('/list', groupListRouter);
groupListRouter.get('/', groupListIdValidator(), wrap(GroupAnimeListController.get));
groupListRouter.post('/:animeId', addToGroupListValidator(), wrap(GroupAnimeListController.add));
groupListRouter.patch('/:animeId', addToGroupListValidator(), wrap(GroupAnimeListController.update));
groupListRouter.delete('/:animeId', [...groupListIdValidator(), ...deleteFromWatchListValidation()], wrap(GroupAnimeListController.delete));

const invitesRouter = Router({ mergeParams: true });
router.use('/invites', invitesRouter);
invitesRouter.get('', wrap(GroupInviteController.getInvites));
invitesRouter.post('/:inviteId/accept', groupInviteActionValidator(), wrap(GroupInviteController.acceptInvite));
invitesRouter.delete('/:inviteId/deny', groupInviteActionValidator(), wrap(GroupInviteController.denyInvite));

export { router as groupListRouter }