import { Router } from "express";
import { wrap } from "../middleware/errorHandler";
import { auth } from "../middleware/auth";
import GroupListController from "../controllers/GroupListController";
import { CreateGroupListValidator, GroupInviteValidator } from "../validators/GroupListValidator";

const router = Router();

router.get('/owned', auth, wrap(GroupListController.getOwnedGroups));
router.post('/', [auth, ...CreateGroupListValidator()], wrap(GroupListController.createGroup));
router.post('/:group_id/invite', [auth, ...GroupInviteValidator()], wrap(GroupListController.inviteUser));
router.get('/invites', auth, wrap(GroupListController.getInvites));

export { router as groupListRouter }