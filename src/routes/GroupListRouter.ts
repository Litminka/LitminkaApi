import { Router } from "express";
import { wrap } from "../middleware/errorHandler";
import { auth } from "../middleware/auth";
import GroupListController from "../controllers/group/GroupListController";
import { CreateGroupListValidator, GroupInviteActionValidator, GroupInviteValidator, GroupListIdValidator } from "../validators/GroupListValidator";
import GroupInviteController from "../controllers/group/GroupInviteController";
import GroupMemberController from "../controllers/group/GroupMemberController";

const router = Router();
router.use(auth)

router.post('/', CreateGroupListValidator(), wrap(GroupListController.createGroup));
router.get('/owned', wrap(GroupListController.getOwnedGroups));
router.get('/member', wrap(GroupMemberController.getMemberGroup));

const groupIdRouter = Router({ mergeParams: true });
router.use('/:group_id', groupIdRouter);
groupIdRouter.post('/invite', ...GroupInviteValidator(), wrap(GroupInviteController.inviteUser));
groupIdRouter.delete('/invite', ...GroupInviteValidator(), wrap(GroupInviteController.deleteInvite));
groupIdRouter.get('/members', ...GroupListIdValidator(), wrap(GroupMemberController.getMembers));
groupIdRouter.patch('/members', ...GroupListIdValidator(), wrap(GroupMemberController.updateState));
groupIdRouter.delete('/members', ...GroupListIdValidator(), wrap(GroupMemberController.leaveGroup))

const invitesRouter = Router({ mergeParams: true });
router.use('/invites', invitesRouter);
invitesRouter.get('', wrap(GroupInviteController.getInvites));
invitesRouter.post('/:invite_id/accept', ...GroupInviteActionValidator(), wrap(GroupInviteController.acceptInvite));
invitesRouter.delete('/:invite_id/deny', ...GroupInviteActionValidator(), wrap(GroupInviteController.denyInvite));

export { router as groupListRouter }