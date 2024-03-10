import { Router } from "express";
import { wrap } from "../middleware/errorHandler";
import { auth } from "../middleware/auth";
import GroupListController from "../controllers/group/GroupListController";
import { AddToGroupListValidator, CreateGroupListValidator, GroupInviteActionValidator, GroupInviteValidator, GroupListIdValidator, GroupListIdWithUserIdValidator } from "../validators/GroupListValidator";
import GroupInviteController from "../controllers/group/GroupInviteController";
import GroupMemberController from "../controllers/group/GroupMemberController";
import GroupAnimeListController from "../controllers/group/GroupAnimeListController";
import { deleteFromWatchListValidation } from "../validators/WatchListValidator";

const router = Router();
router.use(auth)

router.post('/', CreateGroupListValidator(), wrap(GroupListController.createGroup));
router.get('/owned', wrap(GroupListController.getOwnedGroups));
router.get('/member', wrap(GroupMemberController.getMemberGroup));

const groupIdRouter = Router({ mergeParams: true });
router.use('/:groupId', groupIdRouter);

groupIdRouter.delete('/', GroupListIdValidator(), wrap(GroupListController.deleteGroup));
groupIdRouter.patch('/', GroupListIdValidator(), wrap(GroupListController.updateGroup));

groupIdRouter.post('/invite', GroupInviteValidator(), wrap(GroupInviteController.inviteUser));
groupIdRouter.delete('/invite', GroupInviteValidator(), wrap(GroupInviteController.deleteInvite));
groupIdRouter.get('/members', GroupListIdValidator(), wrap(GroupMemberController.getMembers));
groupIdRouter.patch('/members', GroupListIdValidator(), wrap(GroupMemberController.updateState));
groupIdRouter.delete('/members', GroupListIdValidator(), wrap(GroupMemberController.leaveGroup))
groupIdRouter.delete('/members/kick', GroupListIdWithUserIdValidator(), wrap(GroupMemberController.kickUser))

const groupListRouter = Router({ mergeParams: true });
groupIdRouter.use('/list', groupListRouter);
groupListRouter.get('/', GroupListIdValidator(), wrap(GroupAnimeListController.get));
groupListRouter.post('/:animeId', AddToGroupListValidator(), wrap(GroupAnimeListController.add));
groupListRouter.patch('/:animeId', AddToGroupListValidator(), wrap(GroupAnimeListController.update));
groupListRouter.delete('/:animeId', [...GroupListIdValidator(), ...deleteFromWatchListValidation()], wrap(GroupAnimeListController.delete));

const invitesRouter = Router({ mergeParams: true });
router.use('/invites', invitesRouter);
invitesRouter.get('', wrap(GroupInviteController.getInvites));
invitesRouter.post('/:inviteId/accept', GroupInviteActionValidator(), wrap(GroupInviteController.acceptInvite));
invitesRouter.delete('/:inviteId/deny', GroupInviteActionValidator(), wrap(GroupInviteController.denyInvite));

export { router as groupListRouter }