import { Router } from "express";
import { wrap } from "../middleware/errorHandler";
import { auth } from "../middleware/auth";
import GroupListController from "../controllers/GroupListController";
import { CreateGroupListValidator, GroupInviteActionValidator, GroupInviteValidator } from "../validators/GroupListValidator";

const router = Router();

router.get('/owned', auth, wrap(GroupListController.getOwnedGroups));
router.get('/invites', auth, wrap(GroupListController.getInvites));
router.post('/', [auth, ...CreateGroupListValidator()], wrap(GroupListController.createGroup));
router.post('/:group_id/invite', [auth, ...GroupInviteValidator()], wrap(GroupListController.inviteUser));
router.post('/invites/:invite_id/accept', [auth, ...GroupInviteActionValidator()], wrap(GroupListController.acceptInvite));
router.delete('/invites/:invite_id/deny', [auth, ...GroupInviteActionValidator()], wrap(GroupListController.denyInvite));

export { router as groupListRouter }